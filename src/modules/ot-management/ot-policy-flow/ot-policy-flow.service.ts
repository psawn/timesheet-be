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
import { OtPolicyRepository } from '../ot-policy/ot-policy.repository';
import { OtPolicyFlowApprovalDto } from '../ot-policy-flow-approval/dto';
import { OtPolicyFlowApproval } from '../ot-policy-flow-approval/ot-policy-flow-approval.entity';
import { CreateOtPolicyFlow } from './dto';
import { OtPolicyFlow } from './ot-policy-flow.entity';
import { OtPolicyFlowRepository } from './ot-policy-flow.repository';

@Injectable()
export class OtPolicyFlowService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly otPolicyFlowRepository: OtPolicyFlowRepository,
    private readonly otPolicyRepository: OtPolicyRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    otPolicyCode: string,
    user: AuthUserDto,
    createOtPolicyFlow: CreateOtPolicyFlow,
  ) {
    const { departmentCodes } = createOtPolicyFlow;

    const existOtPolicy = await this.otPolicyRepository.findOne({
      where: { code: otPolicyCode },
    });

    if (!existOtPolicy) {
      throw new NotFoundException('Ot policy not found');
    }

    await this.entityManager.transaction(async (transaction) => {
      await this.deleteFlowAndApproval(transaction, otPolicyCode);

      if (departmentCodes.length) {
        await this.departmentRepository.checkDepartments(departmentCodes);

        for (const departmentCode of departmentCodes) {
          await this.createOtRqFlow(
            transaction,
            otPolicyCode,
            departmentCode,
            createOtPolicyFlow,
            user.code,
          );
        }

        return;
      }

      await this.createOtRqFlow(
        transaction,
        otPolicyCode,
        null,
        createOtPolicyFlow,
        user.code,
      );
    });
  }

  async createOtRqFlow(
    transaction: EntityManager,
    otPolicyCode: string,
    departmentCode: string,
    createOtPolicyFlow: CreateOtPolicyFlow,
    userCode: string,
  ) {
    const { flowType, approveForAll, otPolicyFlowApprovals } =
      createOtPolicyFlow;

    const otPolicyFlow = transaction.create(OtPolicyFlow, {
      otPolicyCode,
      department: departmentCode,
      isGlobalFlow: departmentCode ? false : true,
      flowType,
      approveForAll,
      createdBy: userCode,
    });

    await transaction.save(OtPolicyFlow, otPolicyFlow);

    await this.createOtPolicyFlowApproval(
      transaction,
      otPolicyFlow.id,
      otPolicyFlowApprovals,
    );
  }

  async createOtPolicyFlowApproval(
    transaction: EntityManager,
    otPolicyFlowId: string,
    otPolicyFlowApprovals: OtPolicyFlowApprovalDto[],
  ) {
    const savedData = [];

    for (const approval of otPolicyFlowApprovals) {
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
            otPolicyFlowId,
            userCode,
            approverType,
            order,
            subOrder,
            nextByOneApprove,
          });
        }
      } else {
        savedData.push({
          otPolicyFlowId,
          approverType,
          order,
          nextByOneApprove,
        });
      }
    }

    await transaction.save(OtPolicyFlowApproval, savedData);
  }

  async deleteFlowAndApproval(
    transaction: EntityManager,
    otPolicyCode: string,
  ) {
    const existOtPolicyFlow = await this.otPolicyFlowRepository.find({
      where: { otPolicyCode },
    });

    const otPolicyFlowIds = existOtPolicyFlow.map((otPolicyFlow) => {
      return otPolicyFlow.id;
    });

    if (otPolicyFlowIds.length) {
      await transaction.delete(OtPolicyFlowApproval, {
        otPolicyFlowId: In(otPolicyFlowIds),
      });

      await transaction.delete(OtPolicyFlow, { id: In(otPolicyFlowIds) });
    }
  }
}
