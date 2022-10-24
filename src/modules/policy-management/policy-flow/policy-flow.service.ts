import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ApproverTypeEnum } from 'src/common/constants/approver.enum';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { EntityManager, In } from 'typeorm';
import { PolicyFlowApprovalDto } from '../policy-flow-approval/dto';
import { PolicyFlowApproval } from '../policy-flow-approval/policy-flow-approval.entity';
import { PolicyRepository } from '../policy/policy.repository';
import { CreatePolicyFlow } from './dto';
import { PolicyFlow } from './policy-flow.entity';
import { PolicyFlowRepository } from './policy-flow.repository';

@Injectable()
export class PolicyFlowService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly policyFlowRepository: PolicyFlowRepository,
    private readonly policyRepository: PolicyRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    policyCode: string,
    user: AuthUserDto,
    createPolicyFlow: CreatePolicyFlow,
  ) {
    const { departmentCodes } = createPolicyFlow;

    const existPolicy = await this.policyRepository.findOne({
      where: { code: policyCode },
    });

    if (!existPolicy) {
      throw new NotFoundException('Ot policy not found');
    }

    await this.entityManager.transaction(async (transaction) => {
      await this.deleteFlowAndApproval(transaction, policyCode);

      if (departmentCodes.length) {
        await this.departmentRepository.checkDepartments(departmentCodes);

        for (const departmentCode of departmentCodes) {
          await this.createPolicyFlow(
            transaction,
            policyCode,
            departmentCode,
            createPolicyFlow,
            user.code,
          );
        }

        return;
      }

      await this.createPolicyFlow(
        transaction,
        policyCode,
        null,
        createPolicyFlow,
        user.code,
      );
    });
  }

  async createPolicyFlow(
    transaction: EntityManager,
    policyCode: string,
    departmentCode: string,
    createPolicyFlow: CreatePolicyFlow,
    userCode: string,
  ) {
    const { flowType, approveForAll, policyFlowApprovals } = createPolicyFlow;

    const policyFlow = transaction.create(PolicyFlow, {
      policyCode,
      department: departmentCode,
      isGlobalFlow: departmentCode ? false : true,
      flowType,
      approveForAll,
      createdBy: userCode,
    });

    await transaction.save(PolicyFlow, policyFlow);

    await this.createPolicyFlowApproval(
      transaction,
      policyFlow.id,
      policyFlowApprovals,
    );
  }

  async createPolicyFlowApproval(
    transaction: EntityManager,
    policyFlowId: string,
    policyFlowApprovals: PolicyFlowApprovalDto[],
  ) {
    const savedData = [];

    for (const approval of policyFlowApprovals) {
      const { order, users, approverType, nextByOneApprove } = approval;

      if (users.length) {
        if (approverType != ApproverTypeEnum.SPECIFIC_PERSON) {
          throw new BadRequestException('Invalid approval type');
        }

        const userCodes = users.map((user) => {
          return user.userCode;
        });

        await this.userRepository.checkUsers(userCodes);

        for (const user of users) {
          const { subOrder, userCode } = user;
          savedData.push({
            policyFlowId,
            userCode,
            approverType,
            order,
            subOrder,
            nextByOneApprove,
          });
        }
      } else {
        savedData.push({
          policyFlowId,
          approverType,
          order,
          nextByOneApprove,
        });
      }
    }

    await transaction.save(PolicyFlowApproval, savedData);
  }

  async deleteFlowAndApproval(transaction: EntityManager, policyCode: string) {
    const existPolicyFlow = await this.policyFlowRepository.find({
      where: { policyCode },
    });

    const policyFlowIds = existPolicyFlow.map((policyFlow) => {
      return policyFlow.id;
    });

    if (policyFlowIds.length) {
      await transaction.delete(PolicyFlowApproval, {
        policyFlowId: In(policyFlowIds),
      });

      await transaction.delete(PolicyFlow, { id: In(policyFlowIds) });
    }
  }
}
