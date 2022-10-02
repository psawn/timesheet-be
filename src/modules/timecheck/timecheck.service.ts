import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectEntityManager } from '@nestjs/typeorm';
import { get } from 'lodash';
import * as moment from 'moment';
import { calculateDiffMin } from 'src/helpers/calculate-diff-minute.helper';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { HolidayBenefitRepository } from '../benefit-management/holiday-benefit/holiday-benefit.repository';
import { RemoteWorkingRepository } from '../request-management/remote-working/remote-working.repository';
import { UserRepository } from '../user-management/user/user.repository';
import { GenWorktimeRepository } from '../worktime-management/general-worktime/general-worktime.repository';
import { CheckInDto, FilterTimecheckDto } from './dto';
import { Test } from './dto/abc.dto';
import { Timecheck } from './timecheck.entity';
import { TimecheckRepository } from './timecheck.repository';

@Injectable()
export class TimecheckService {
  constructor(
    private readonly timecheckRepository: TimecheckRepository,
    private readonly userRepository: UserRepository,
    private readonly remoteWorkingRepository: RemoteWorkingRepository,
    private readonly genWorktimeRepository: GenWorktimeRepository,
    private readonly holidayBenefitRepository: HolidayBenefitRepository,
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

  async getTotalWorkingDays(test: Test) {
    const dayOffs = await this.genWorktimeRepository.getWorktime(
      test.worktimeCode,
    );

    const dayOffArr = dayOffs.map((dayOff) => {
      return dayOff.dayOfWeek;
    });

    const holidays = await this.holidayBenefitRepository.getHolidays(
      test.startDate,
      test.endDate,
    );

    const startDate = new Date(test.startDate);
    const endDate = new Date(test.endDate);

    let count = 0;
    const curDate = new Date(startDate.getTime());

    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();

      if (!dayOffArr.includes(dayOfWeek)) {
        count++;
        holidays.map((holiday) => {
          const isHoliday = moment(curDate).isBetween(
            moment(holiday.startDate),
            moment(holiday.endDate),
            null,
            '[]',
          );

          if (isHoliday) {
            count--;
          }
        });
      }

      curDate.setDate(curDate.getDate() + 1);
    }

    console.log(count);
  }
}
