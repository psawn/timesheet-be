import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectEntityManager } from '@nestjs/typeorm';
import { get } from 'lodash';
import * as moment from 'moment';
import { calculateDiffMin } from 'src/helpers/calculate-diff-minute.helper';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { RemoteWorkingRepository } from '../request-management/remote-working/remote-working.repository';
import { UserRepository } from '../user-management/user/user.repository';
import { CheckInDto, FilterTimecheckDto } from './dto';
import { Timecheck } from './timecheck.entity';
import { TimecheckRepository } from './timecheck.repository';

@Injectable()
export class TimecheckService {
  constructor(
    private readonly timecheckRepository: TimecheckRepository,
    private readonly userRepository: UserRepository,
    private readonly remoteWorkingRepository: RemoteWorkingRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getAll(filterTimecheckDto: FilterTimecheckDto) {
    return await this.userRepository.getTimechecks(filterTimecheckDto);
  }

  async getMyTimecheck(
    user: AuthUserDto,
    filterTimecheckDto: FilterTimecheckDto,
  ) {
    const conditions = { code: user.code };
    return await this.userRepository.getTimechecks(
      filterTimecheckDto,
      conditions,
    );
  }

  async checkIn(user: AuthUserDto, checkInDto: CheckInDto) {
    const current = new Date();
    const checkDate = new Date(
      moment(current)
        .subtract(checkInDto.timezone, 'hours')
        .format('YYYY-MM-DD'),
    );
    const checktime = moment(current)
      .subtract(checkInDto.timezone, 'hours')
      .format('HH:mm:ss');

    const canRemoteCheckIn = await this.remoteWorkingRepository.count({
      where: {
        startDate: LessThanOrEqual(checkDate),
        endDate: MoreThanOrEqual(checkDate),
        userCode: user.code,
      },
    });

    if (!canRemoteCheckIn) {
      throw new BadRequestException(`Don't have permission to check in`);
    }

    const worktime = await this.userRepository.getUserWorktime(
      user.code,
      checkDate,
    );

    console.log(worktime);

    const worktimCheckIn = get(
      worktime,
      'worktimeStg.worktime.checkInTime',
      null,
    );
    const worktimeCheckOut = get(
      worktime,
      'worktimeStg.worktime.checkOutTime',
      null,
    );
    const isDayOff = get(worktime, 'worktimeStg.worktime.isDayOff', false);

    console.log(isDayOff);

    if (!worktimCheckIn || !worktimeCheckOut) {
      throw new NotFoundException('Worktime not found');
    }

    return await this.entityManager.transaction(async (transaction) => {
      const existTimecheck = await transaction.findOne(Timecheck, {
        where: { userCode: user.code, checkDate },
      });

      if (existTimecheck) {
        if (existTimecheck.checkInTime) {
          const diffChecktimeInMin = calculateDiffMin(
            worktimeCheckOut,
            checktime,
          );
          const worktime =
            calculateDiffMin(checktime, existTimecheck.checkInTime) / 60;

          existTimecheck.checkOutTime = checktime;
          existTimecheck.missCheckOutMin = diffChecktimeInMin;
          existTimecheck.missCheckOut = diffChecktimeInMin > 0 ? true : false;
          existTimecheck.workHour = +worktime.toFixed(1);
        } else {
          const diffChecktimeInMin = calculateDiffMin(
            checktime,
            worktimCheckIn,
          );

          existTimecheck.checkInTime = checktime;
          existTimecheck.missCheckInMin = diffChecktimeInMin;
          existTimecheck.missCheckIn = diffChecktimeInMin > 0 ? true : false;
        }

        existTimecheck.timezone = checkInDto.timezone;
        existTimecheck.isDayOff = isDayOff;
        return await transaction.save(Timecheck, existTimecheck);
      } else {
        const timecheck = transaction.create(Timecheck, {
          userCode: user.code,
          username: user.name,
          timezone: checkInDto.timezone,
          checkDate,
          checkInTime: checktime,
          isDayOff,
        });

        return await transaction.save(Timecheck, timecheck);
      }
    });
  }
}
