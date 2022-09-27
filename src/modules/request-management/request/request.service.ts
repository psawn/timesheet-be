import { Injectable, NotFoundException } from '@nestjs/common';
import { isEmpty, pick } from 'lodash';
import * as moment from 'moment';
import { getApprover } from 'src/helpers/get-approver.helper';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { PolicyRepository } from 'src/modules/policy-management/policy/policy.repository';
import { CreateRequestDto } from './dto';
import { RequestRepository } from './request.repository';

@Injectable()
export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly policyRepository: PolicyRepository,
  ) {}

  async createRequest(user: AuthUserDto, createRequestDto: CreateRequestDto) {
    const { policyCode } = createRequestDto;

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

    const request = this.requestRepository.create({
      ...createRequestDto,
      userCode: user.code,
      configPolicy,
      expireTime,
      approverCode: approver.code,
      policyType: existPolicy.typeCode,
    });

    return request.save();
  }
}
