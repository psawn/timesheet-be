import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { get, isEmpty, pick } from 'lodash';
import * as moment from 'moment';
import { RequestTypeCode } from 'src/common/constants/request-type-code.enum';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { getApprover } from 'src/helpers/get-approver.helper';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { HolidayBenefitRepository } from 'src/modules/benefit-management/holiday-benefit/holiday-benefit.repository';
import { UserLeaveBenefit } from 'src/modules/benefit-management/user-leave-benefit/user-leave-benefit.entity';
import { PolicyRepository } from 'src/modules/policy-management/policy/policy.repository';
import { Timecheck } from 'src/modules/timecheck/timecheck.entity';
import { User } from 'src/modules/user-management/user/user.entity';
import { GenWorktimeStgRepository } from 'src/modules/worktime-management/general-worktime-setting/general-worktime-setting.repository';
import { GeneralWorktime } from 'src/modules/worktime-management/general-worktime/general-worktime.entity';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { RemoteWorking } from '../remote-working/remote-working.entity';
import { RequestDateDto } from '../request-date/dto/request-date.dto';
import { TimeRequestDate } from '../request-date/request-date.entity';
import {
  ChangeRequestStatus,
  CreateRequestDto,
  FilterRequestsDto,
} from './dto';
import { TimeRequest } from './request.entity';
import { RequestRepository } from './request.repository';

@Injectable()
export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly policyRepository: PolicyRepository,
    private readonly genWorktimeStgRepository: GenWorktimeStgRepository,
    private readonly holidayBenefitRepository: HolidayBenefitRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createRequest(user: AuthUserDto, createRequestDto: CreateRequestDto) {
    const { policyCode } = createRequestDto;
    let dates = await this.checkDateTimeRq(createRequestDto.dates);

    if (!user.department) {
      throw new BadRequestException(`User dont's have department`);
    }

    const existPolicy = await this.policyRepository.getPolicyWithApprover(
      policyCode,
      user.managerCode,
      user.department,
    );

    if (!existPolicy) {
      throw new NotFoundException('Policy not found');
    }

    const configPolicy: any = pick(existPolicy, [
      'name',
      'code',
      'typeCode',
      'group',
      'maxDaysProcess',
      'useAnnualLeave',
      'workDay',
    ]);

    const approver = getApprover(existPolicy);

    if (isEmpty(approver)) {
      throw new NotFoundException('Approver not found');
    }

    const expireTime = existPolicy.maxDaysProcess
      ? moment(new Date()).add(existPolicy.maxDaysProcess, 'days')
      : null;

    const query = this.genWorktimeStgRepository
      .createQueryBuilder('setting')
      .leftJoinAndMapMany(
        'setting.worktime',
        GeneralWorktime,
        'worktime',
        'setting.code = worktime.worktimeCode',
      )
      .orderBy('worktime.dayOfWeek', 'ASC');

    const worktimeStg = await query.getOne();

    if (!worktimeStg || !worktimeStg['worktime']) {
      throw new NotFoundException('Worktime not found');
    }

    dates = dates
      .map((date) => {
        const { startDate } = date;
        const matchWt = worktimeStg['worktime'].find(
          (wt) => wt.dayOfWeek == startDate.getUTCDay() && wt.isDayOff == false,
        );

        if (matchWt) {
          if (
            existPolicy.typeCode == RequestTypeCode.MISSING_IN ||
            existPolicy.typeCode == RequestTypeCode.MISSING_OUT
          ) {
            return {
              ...date,
              startTime: matchWt.checkInTime,
              endTime: matchWt.checkOutTime,
            };
          }
          return { ...date };
        }
      })
      .filter((item) => item !== undefined);

    return await this.entityManager.transaction(async (transaction) => {
      const request = transaction.create(TimeRequest, {
        ...createRequestDto,
        userCode: user.code,
        configPolicy,
        expireTime,
        approverCode: approver.code,
        policyType: existPolicy.typeCode,
      });

      await transaction.save(TimeRequest, request);

      const savedDates = transaction.create(
        TimeRequestDate,
        dates.map((date) => {
          return {
            ...date,
            requestId: request.id,
            userCode: user.code,
          };
        }),
      );

      await transaction.save(TimeRequestDate, savedDates);
      return request;
    });
  }

  async getAll(filterRequestsDto: FilterRequestsDto) {
    return await this.requestRepository.getAll(filterRequestsDto);
  }

  async get(id: string) {
    return await this.requestRepository.get(id);
  }

  async getAllMyRequests(
    user: AuthUserDto,
    filterRequestsDto: FilterRequestsDto,
  ) {
    const conditions = { userCode: user.code };
    return await this.requestRepository.getAll(filterRequestsDto, conditions);
  }

  async getMyRequest(user: AuthUserDto, id: string) {
    const conditions = { userCode: user.code };
    return await this.requestRepository.get(id, conditions);
  }

  async changeStatus(
    user: AuthUserDto,
    changeRequestStatus: ChangeRequestStatus,
  ) {
    const { requestIds, status } = changeRequestStatus;

    for (const id of requestIds) {
      const query = this.requestRepository
        .createQueryBuilder('request')
        .leftJoinAndMapOne(
          'request.sender',
          User,
          'sender',
          'request.userCode = sender.code',
        )
        .leftJoinAndMapMany(
          'request.dates',
          TimeRequestDate,
          'date',
          'request.id = date.requestId',
        )
        .where({ id, approverCode: user.code });

      const existRequest = await query.getOne();

      const group = get(existRequest, 'configPolicy.group', null);
      const dates = get(existRequest, 'dates', null);

      const config = {
        workDay: get(existRequest, 'configPolicy.workDay', null),
        username: get(existRequest, 'sender.name', null),
        userCode: existRequest.userCode,
        timezone: existRequest.timezone,
        approverCode: existRequest.approverCode,
      };

      if (!existRequest) {
        throw new NotFoundException('Request for approver not found');
      }

      if (existRequest.status !== StatusRequestEnum.WAITING) {
        throw new BadRequestException('Request status is not WAITING');
      }

      await this.entityManager.transaction(async (transaction) => {
        existRequest.status = status;
        transaction.save(TimeRequest, existRequest);

        if (status == StatusRequestEnum.APPROVED) {
          await this.handleMappingBusiness(
            transaction,
            group,
            existRequest.policyType,
            dates,
            config,
          );
        }
      });
    }
  }

  async handleMappingBusiness(
    transaction: EntityManager,
    group: string,
    policyType: string,
    dates: TimeRequestDate[],
    config: any,
  ) {
    const functionMap = {
      ATTENDANCE: {
        MISSING_IN: 'handleMissingCheckIn',
        MISSING_OUT: 'handleMissingCheckOut',
      },
      ABSENCE: {
        MORNING_ABSENT: 'handleAbsenct',
        AFTERNOON_ABSENT: 'handleAbsenct',
        FULL_DAY_ABSENT: 'handleAbsenct',
      },
      OTHER: {
        REMOTE_WORKING: 'handleRemoteWorking',
      },
    };
    await this[functionMap[group][policyType]](transaction, dates, config);
  }

  async handleMissingCheckIn(
    transaction: EntityManager,
    dates: TimeRequestDate[],
    config: any,
  ) {
    for (const date of dates) {
      const existTimecheck = await transaction.findOne(Timecheck, {
        where: { checkDate: date.startDate, userCode: date.userCode },
      });

      if (existTimecheck) {
        existTimecheck.checkInTime = date.startTime;
        existTimecheck.missCheckIn = false;
        existTimecheck.missCheckInMin = 0;
        existTimecheck.timezone = config.timezone;

        await transaction.save(Timecheck, existTimecheck);
      } else {
        const timecheck = transaction.create(Timecheck, {
          checkDate: date.startDate,
          checkInTime: date.startTime,
          userCode: date.userCode,
          username: config.username,
          timezone: config.timezone,
        });

        await transaction.save(Timecheck, timecheck);
      }
    }
  }

  async handleMissingCheckOut(
    transaction: EntityManager,
    dates: TimeRequestDate[],
    config: any,
  ) {
    for (const date of dates) {
      const existTimecheck = await transaction.findOne(Timecheck, {
        where: { checkDate: date.startDate, userCode: date.userCode },
      });

      if (existTimecheck) {
        existTimecheck.checkOutTime = date.endTime;
        existTimecheck.missCheckOut = false;
        existTimecheck.missCheckOutMin = 0;
        existTimecheck.timezone = config.timezone;

        await transaction.save(Timecheck, existTimecheck);
      } else {
        const timecheck = transaction.create(Timecheck, {
          checkDate: date.startDate,
          checkOutTime: date.endTime,
          userCode: date.userCode,
          username: config.username,
          timezone: config.timezone,
        });

        await transaction.save(timecheck);
      }
    }
  }

  async handleAbsenct(
    transaction: EntityManager,
    dates: TimeRequestDate[],
    config: any,
  ) {
    const existUserLeaveBnf = await transaction.findOne(UserLeaveBenefit, {
      where: { year: new Date().getUTCFullYear(), userCode: config.userCode },
    });
    const leaveDay = config.workDay * dates.length;

    if (existUserLeaveBnf) {
      existUserLeaveBnf.remainingDay =
        existUserLeaveBnf.remainingDay - leaveDay;
      existUserLeaveBnf.usedDay = existUserLeaveBnf.usedDay + leaveDay;

      await transaction.save(UserLeaveBenefit, existUserLeaveBnf);
    }

    for (const date of dates) {
      const existTimecheck = await transaction.findOne(Timecheck, {
        where: { checkDate: date.startDate, userCode: config.userCode },
      });

      const leaveHour = config.workDay * +process.env.DEFAULT_WORK_HOUR;

      if (existTimecheck) {
        existTimecheck.isLeaveBenefit = true;
        existTimecheck.leaveHour = leaveHour;
        existTimecheck.timezone = config.timezone;

        await transaction.save(Timecheck, existTimecheck);
      } else {
        const timecheck = transaction.create(Timecheck, {
          userCode: config.userCode,
          username: config.username,
          checkDate: date.startDate,
          isLeaveBenefit: true,
          leaveHour,
          timezone: config.timezone,
        });

        await transaction.save(Timecheck, timecheck);
      }
    }
  }

  async checkDateTimeRq(dates: RequestDateDto[]) {
    const dateArr = [];
    for (const date of dates) {
      const countExistDate = await this.holidayBenefitRepository.count({
        where: {
          startDate: LessThanOrEqual(date.startDate),
          endDate: MoreThanOrEqual(date.startDate),
        },
      });

      if (!countExistDate) {
        dateArr.push(date);
      }
    }
    return dateArr;
  }

  async handleRemoteWorking(
    transaction: EntityManager,
    dates: TimeRequestDate[],
    config: any,
  ) {
    const remoteWorkings = transaction.create(
      RemoteWorking,
      dates.map((date) => {
        const { startDate, endDate, requestId } = date;
        return {
          startDate,
          endDate,
          requestId,
          approverCode: config.approverCode,
          userCode: config.userCode,
        };
      }),
    );
    await transaction.save(RemoteWorking, remoteWorkings);
  }
}
