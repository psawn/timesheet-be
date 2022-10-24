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
import { OtRequestFlowApprovalDto } from '../ot-request-flow-approval/dto';
import { OtRequestFlowApproval } from '../ot-request-flow-approval/ot-request-flow-approval.entity';
import { CreateOtRequestFlow } from './dto';
import { OtRequestFlow } from './ot-request-flow.entity';
import { OtRequestFlowRepository } from './ot-request-flow.repository';

@Injectable()
export class OtRequestFlowService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly otRequestFlowRepository: OtRequestFlowRepository,
    private readonly otPolicyRepository: OtPolicyRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    otPolicyCode: string,
    user: AuthUserDto,
    createOtRequestFlow: CreateOtRequestFlow,
  ) {
    const { departmentCodes } = createOtRequestFlow;

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
            createOtRequestFlow,
            user.code,
          );
        }

        return;
      }

      await this.createOtRqFlow(
        transaction,
        otPolicyCode,
        null,
        createOtRequestFlow,
        user.code,
      );
    });
  }

  async createOtRqFlow(
    transaction: EntityManager,
    otPolicyCode: string,
    departmentCode: string,
    createOtRequestFlow: CreateOtRequestFlow,
    userCode: string,
  ) {
    const { flowType, approveForAll, otRequestFlowApprovals } =
      createOtRequestFlow;

    const otRequestFlow = transaction.create(OtRequestFlow, {
      otPolicyCode,
      department: departmentCode,
      isGlobalFlow: departmentCode ? false : true,
      flowType,
      approveForAll,
      createdBy: userCode,
    });

    await transaction.save(OtRequestFlow, otRequestFlow);

    await this.createOtRequestFlowApproval(
      transaction,
      otRequestFlow.id,
      otRequestFlowApprovals,
    );
  }

  async createOtRequestFlowApproval(
    transaction: EntityManager,
    otRequestFlowId: string,
    otRequestFlowApprovals: OtRequestFlowApprovalDto[],
  ) {
    const savedData = [];

    for (const approval of otRequestFlowApprovals) {
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
            otRequestFlowId,
            userCode,
            approverType,
            order,
            subOrder,
            nextByOneApprove,
          });
        }
      } else {
        savedData.push({
          otRequestFlowId,
          approverType,
          order,
          nextByOneApprove,
        });
      }
    }

    await transaction.save(OtRequestFlowApproval, savedData);
  }

  async deleteFlowAndApproval(
    transaction: EntityManager,
    otPolicyCode: string,
  ) {
    const existOtRequestFlow = await this.otRequestFlowRepository.find({
      where: { otPolicyCode },
    });

    const otRequestFlowIds = existOtRequestFlow.map((otRequestFlow) => {
      return otRequestFlow.id;
    });

    if (otRequestFlowIds.length) {
      await transaction.delete(OtRequestFlowApproval, {
        otRequestFlowId: In(otRequestFlowIds),
      });

      await transaction.delete(OtRequestFlow, { id: In(otRequestFlowIds) });
    }
  }
}
