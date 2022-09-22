import { Injectable, NotFoundException } from '@nestjs/common';
import { ApproverTypeEnum } from 'src/common/constants/approver.enum';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { In } from 'typeorm';
import { PolicyRepository } from '../policy/policy.repository';
import { AddApproverDto } from './dto';
import { PolicyApproverRepository } from './policy-approver.repository';

@Injectable()
export class PolicyApproverService {
  constructor(
    private readonly policyApproverRepository: PolicyApproverRepository,
    private readonly policyRepository: PolicyRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async addApprover(addApproverDto: AddApproverDto) {
    const data = [];
    const { policyCode, approverType, departmentCodes } = addApproverDto;
    const approverCode =
      addApproverDto.approverType == ApproverTypeEnum.SPECIFIC_PERSON
        ? addApproverDto.approverCode
        : null;

    const existPolicy = await this.policyRepository.findOne({
      where: { code: policyCode },
    });

    if (!existPolicy) {
      throw new NotFoundException('Policy not found');
    }

    const departmentCount = await this.departmentRepository.count({
      where: { code: In(departmentCodes), isActive: true },
    });

    if (departmentCount != departmentCodes.length) {
      throw new NotFoundException('Department not found');
    }

    if (approverCode) {
      const existUser = await this.userRepository.findOne({
        where: {
          code: approverCode,
        },
      });

      if (!existUser) {
        throw new NotFoundException('User not found');
      }
    }

    departmentCodes.map((departmentCode) => {
      data.push({
        policyCode,
        approverType,
        approverCode,
        departmentCode,
      });
    });

    await this.policyApproverRepository.delete({ policyCode });
    const approvers = this.policyApproverRepository.create(data);
    await this.policyApproverRepository.insert(approvers);
  }
}
