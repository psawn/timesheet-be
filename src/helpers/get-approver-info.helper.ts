import { NotFoundException } from '@nestjs/common';
import { ApproverTypeEnum } from 'src/common/constants/approver.enum';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { PolicyFlowApproval } from 'src/modules/policy-management/policy-flow-approval/policy-flow-approval.entity';
import { UserRepository } from 'src/modules/user-management/user/user.repository';

export const getApproverInfo = async (
  approval: PolicyFlowApproval,
  departmentCode: string,
  managerCode: string,
  departmentRepository: DepartmentRepository,
  userRepository: UserRepository,
) => {
  switch (approval.approverType) {
    case ApproverTypeEnum.DEPARTMENT_MANAGER:
      const department = await departmentRepository.findOne({
        where: { code: departmentCode, isActive: true },
      });

      if (department) {
        return {
          ...approval,
          userCode: department.managerCode,
        };
      } else {
        throw new NotFoundException('Department manager not found');
      }

    case ApproverTypeEnum.DIRECT_MANAGER:
      const directManager = await userRepository.findOne({
        where: { code: managerCode },
      });

      if (directManager) {
        return {
          ...approval,
          userCode: directManager.code,
        };
      } else {
        throw new NotFoundException('Direct manager not found');
      }

    default:
      return { ...approval };
  }
};
