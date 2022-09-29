import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { get, isEmpty, pick } from 'lodash';
import * as moment from 'moment';
import { PolicyGroup } from 'src/common/constants/policy-group.enum';
import { RequestTypeCode } from 'src/common/constants/request-type-code.enum';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { getApprover } from 'src/helpers/get-approver.helper';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { PolicyRepository } from 'src/modules/policy-management/policy/policy.repository';
import { GenWorktimeStgRepository } from 'src/modules/worktime-management/general-worktime-setting/general-worktime-setting.repository';
import { GeneralWorktime } from 'src/modules/worktime-management/general-worktime/general-worktime.entity';
import { EntityManager, In } from 'typeorm';
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
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createRequest(user: AuthUserDto, createRequestDto: CreateRequestDto) {
    const { policyCode } = createRequestDto;
    let dates = createRequestDto.dates;

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

    if (
      existPolicy.typeCode == RequestTypeCode.MISSING_IN ||
      existPolicy.typeCode == RequestTypeCode.MISSING_OUT
    ) {
      const query = this.genWorktimeStgRepository
        .createQueryBuilder('setting')
        .leftJoinAndMapMany(
          'setting.worktime',
          GeneralWorktime,
          'worktime',
          'setting.code = worktime.workTimeCode',
        )
        .orderBy('worktime.dayOfWeek', 'ASC');

      const worktimeStg = await query.getOne();

      if (!worktimeStg || !worktimeStg['worktime']) {
        throw new NotFoundException('Worktime not found');
      }

      dates = dates.map((date) => {
        const { endDate } = date;
        const matchWt = worktimeStg['worktime'].find(
          (wt) => wt.dayOfWeek == endDate.getUTCDay(),
        );
        return {
          ...date,
          startTime: matchWt.checkInTime,
          endTime: matchWt.checkOutTime,
        };
      });
    }

    return await this.entityManager.transaction(async (transaction) => {
      const request = transaction.create(TimeRequest, {
        ...createRequestDto,
        userCode: user.code,
        configPolicy,
        expireTime,
        approverCode: approver.code,
        policyType: existPolicy.typeCode,
      });

      await request.save();

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

      console.log('group', group);

      console.log('policyType', existRequest.policyType);

      console.log('dates', dates);

      if (!existRequest) {
        throw new NotFoundException('Request for approver not found');
      }

      if (existRequest.status !== StatusRequestEnum.WAITING) {
        throw new BadRequestException('Request status is not WAITING');
      }

      await this.handleMappingBusiness(group, existRequest.policyType, dates);
      // await this.entityManager.transaction(async (transaction) => {
      //   existRequest.status = status;
      //   transaction.save(TimeRequest, existRequest);

      //   if (status == StatusRequestEnum.APPROVED) {
      //     //
      //   }
      // });
    }
  }

  async handleMappingBusiness(
    group: string,
    policyType: string,
    dates: TimeRequestDate[],
  ) {
    const functionMap = {
      'ATTENDANCE,MISSING_IN': 'handleMissingCheckIn',
      'ATTENDANCE,MISSING_OUT': 'handleMissingCheckOut',
    };
    await this[functionMap[`${group},${policyType}`]](dates);
  }

  async handleMissingCheckIn(dates: TimeRequestDate[]) {
    console.log('asdsad');
  }

  async handleMissingCheckOut(dates: TimeRequestDate[]) {
    //
  }
}
