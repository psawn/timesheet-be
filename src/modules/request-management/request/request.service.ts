import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { get, isEmpty, pick } from 'lodash';
import * as moment from 'moment';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { calculateDiffMin } from 'src/helpers/calculate-diff-minute.helper';
import { getApprover } from 'src/helpers/get-approver.helper';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { HolidayBenefitRepository } from 'src/modules/benefit-management/holiday-benefit/holiday-benefit.repository';
import { UserLeaveBenefit } from 'src/modules/benefit-management/user-leave-benefit/user-leave-benefit.entity';
import { PolicyRepository } from 'src/modules/policy-management/policy/policy.repository';
import { Timecheck } from 'src/modules/timecheck/timecheck.entity';
import { User } from 'src/modules/user-management/user/user.entity';
import { GenWorktimeStgRepository } from 'src/modules/worktime-management/general-worktime-setting/general-worktime-setting.repository';
import { GeneralWorktime } from 'src/modules/worktime-management/general-worktime/general-worktime.entity';
import { MailService } from 'src/shared/services/mail.service';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { RemoteWorking } from '../remote-working/remote-working.entity';
import { RequestDateDto } from '../request-date/dto/request-date.dto';
import { TimeRequestDate } from '../request-date/request-date.entity';
import { RequestWorkingDate } from '../request-working-date/request-working-date.entity';
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
    private readonly mailService: MailService,
  ) {}

  async createRequest(user: AuthUserDto, createRequestDto: CreateRequestDto) {
    const { policyCode } = createRequestDto;
    const dates = await this.checkDateTimeRq(createRequestDto.dates);
    const workingDates = [];
    let totalDate = 0;

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

    dates.map((date) => {
      let currentDate = new Date(date.startDate);
      const endDate = new Date(date.endDate);

      while (currentDate <= endDate) {
        const matchWt = worktimeStg['worktime'].find(
          (wt) =>
            wt.dayOfWeek == currentDate.getUTCDay() && wt.isDayOff == false,
        );

        if (matchWt) {
          totalDate++;
          workingDates.push({
            workDate: new Date(currentDate),
            checkInTime: matchWt.checkInTime,
            checkOutTime: matchWt.checkOutTime,
          });
        }

        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
    });

    if (!totalDate || !workingDates.length) {
      throw new BadRequestException('Invalid date');
    }

    return await this.entityManager.transaction(async (transaction) => {
      const request = transaction.create(TimeRequest, {
        ...createRequestDto,
        userCode: user.code,
        configPolicy,
        expireTime,
        approverCode: approver.code,
        policyType: existPolicy.typeCode,
        totalDate,
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

      const savedWorkingDates = transaction.create(
        RequestWorkingDate,
        workingDates.map((workingDate) => {
          return {
            ...workingDate,
            requestId: request.id,
            userCode: user.code,
          };
        }),
      );

      await transaction.save(RequestWorkingDate, savedWorkingDates);

      const config = {
        from: '"📧 Timesheet notification" <huynvth2001006@fpt.edu.vn>',
        to: approver.email,
        subject: 'One request have been assigned to you',
        text: 'Timesheet notification',
        html: '<b>One request have been to assigned to you. Please check it.</b>',
      };

      await this.mailService.sendMail(config);

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

  async getAllToApprover(
    user: AuthUserDto,
    filterRequestsDto: FilterRequestsDto,
  ) {
    const conditions = { approverCode: user.code };
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
          'request.workingTimes',
          RequestWorkingDate,
          'workingTime',
          'request.id = workingTime.requestId',
        )
        .where({ id, approverCode: user.code });

      const existRequest = await query.getOne();

      if (!existRequest) {
        throw new NotFoundException('Request for approver not found');
      }

      const group = get(existRequest, 'configPolicy.group', null);
      const workingDates = get(existRequest, 'workingTimes', []);

      const config = {
        workDay: get(existRequest, 'configPolicy.workDay', null),
        username: get(existRequest, 'sender.name', null),
        userCode: existRequest.userCode,
        timezone: existRequest.timezone,
        approverCode: existRequest.approverCode,
      };

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
            workingDates,
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
    workingDates: RequestWorkingDate[],
    config: any,
  ) {
    console.log('config', config);
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

    await this[functionMap[group][policyType]](
      transaction,
      workingDates,
      config,
    );
  }

  async handleMissingCheckIn(
    transaction: EntityManager,
    dates: RequestWorkingDate[],
    config: any,
  ) {
    for (const date of dates) {
      const existTimecheck = await transaction.findOne(Timecheck, {
        where: { checkDate: date.workDate, userCode: date.userCode },
      });

      if (existTimecheck) {
        if (existTimecheck.checkOutTime) {
          const worktime =
            calculateDiffMin(existTimecheck.checkOutTime, date.checkInTime) /
            60;

          existTimecheck.workHour = +worktime.toFixed(1);
        }

        existTimecheck.checkInTime = date.checkInTime;
        existTimecheck.missCheckIn = false;
        existTimecheck.missCheckInMin = 0;
        existTimecheck.timezone = config.timezone;

        await transaction.save(Timecheck, existTimecheck);
      } else {
        const timecheck = transaction.create(Timecheck, {
          checkDate: date.workDate,
          checkInTime: date.checkInTime,
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
    dates: RequestWorkingDate[],
    config: any,
  ) {
    for (const date of dates) {
      const existTimecheck = await transaction.findOne(Timecheck, {
        where: { checkDate: date.workDate, userCode: date.userCode },
      });

      if (existTimecheck) {
        if (existTimecheck.checkInTime) {
          const worktime =
            calculateDiffMin(date.checkOutTime, existTimecheck.checkInTime) /
            60;

          existTimecheck.workHour = +worktime.toFixed(1);
        }

        existTimecheck.checkOutTime = date.checkOutTime;
        existTimecheck.missCheckOut = false;
        existTimecheck.missCheckOutMin = 0;
        existTimecheck.timezone = config.timezone;

        await transaction.save(Timecheck, existTimecheck);
      } else {
        const timecheck = transaction.create(Timecheck, {
          checkDate: date.workDate,
          checkOutTime: date.checkOutTime,
          userCode: date.userCode,
          username: config.username,
          timezone: config.timezone,
        });

        await transaction.save(Timecheck, timecheck);
      }
    }
  }

  async handleAbsenct(
    transaction: EntityManager,
    dates: RequestWorkingDate[],
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
        where: { checkDate: date.workDate, userCode: config.userCode },
      });

      const leaveHour = config.workDay * +process.env.DEFAULT_WORK_HOUR;

      if (existTimecheck) {
        existTimecheck.isLeaveBenefit = true;
        existTimecheck.leaveHour =
          existTimecheck.leaveHour + leaveHour >= +process.env.DEFAULT_WORK_HOUR
            ? +process.env.DEFAULT_WORK_HOUR
            : existTimecheck.leaveHour + leaveHour;
        existTimecheck.timezone = config.timezone;

        await transaction.save(Timecheck, existTimecheck);
      } else {
        const timecheck = transaction.create(Timecheck, {
          userCode: config.userCode,
          username: config.username,
          checkDate: date.workDate,
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
    dates: RequestWorkingDate[],
    config: any,
  ) {
    const remoteWorkings = transaction.create(
      RemoteWorking,
      dates.map((date) => {
        const { workDate, requestId, checkInTime, checkOutTime } = date;
        return {
          workDate,
          requestId,
          checkInTime,
          checkOutTime,
          approverCode: config.approverCode,
          userCode: config.userCode,
        };
      }),
    );
    await transaction.save(RemoteWorking, remoteWorkings);
  }
}
