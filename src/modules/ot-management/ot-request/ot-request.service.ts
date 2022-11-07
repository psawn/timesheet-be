import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { get, isEmpty, maxBy, omit } from 'lodash';
import * as moment from 'moment';
import { ApproverTypeEnum } from 'src/common/constants/approver.enum';
import { RequestFlowEnum } from 'src/common/constants/request-flow.enum';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { getApproverInfo } from 'src/helpers/get-approver-info.helper';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { ProjectUserRepository } from 'src/modules/project-management/project-user/project-user.repository';
import { User } from 'src/modules/user-management/user/user.entity';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { EntityManager, Not } from 'typeorm';
import { OtPlan } from '../ot-plan/ot-plan.entity';
import { OtPlanRepository } from '../ot-plan/ot-plan.repository';
import { OtPolicy } from '../ot-policy/ot-policy.entity';
import { OtRequestApprover } from '../ot-request-approver/ot-request-approver.entity';
import { OtRequestDateDto } from '../ot-request-date/dto';
import { OtRequestDate } from '../ot-request-date/ot-request-date.entity';
import {
  ChangeOtRequestStatus,
  CreateOtRequestDto,
  FilterOtRequestsDto,
  UpdateOtRequestDto,
} from './dto';
import { OtRequest } from './ot-request.entity';
import { OtRequestRepository } from './ot-request.repository';
import { Timecheck } from 'src/modules/timecheck/timecheck.entity';

@Injectable()
export class OtRequestService {
  constructor(
    private readonly otRequestRepository: OtRequestRepository,
    private readonly otPlanRepository: OtPlanRepository,
    private readonly projectUserRepository: ProjectUserRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly userRepository: UserRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(user: AuthUserDto, createOtRequestDto: CreateOtRequestDto) {
    const { otPlanId, otRequestDates, reason } = createOtRequestDto;

    const ownedProjects = await this.projectUserRepository.find({
      where: { isActive: true, userCode: user.code },
    });

    const projects = ownedProjects.map((project) => {
      return project.projectCode;
    });

    const existOtPlan = await this.otPlanRepository.getOtPlanInfo(
      otPlanId,
      user.department,
    );

    const otPolicy: OtPolicy = get(existOtPlan, 'otPolicy');

    if (!existOtPlan) {
      throw new NotFoundException('Ot plan not found');
    }

    if (!otPolicy) {
      throw new NotFoundException('Ot policy not found');
    }

    if (existOtPlan.status !== StatusRequestEnum.APPROVED) {
      throw new BadRequestException('Ot plan status is not approved');
    }

    if (!projects.includes(existOtPlan.projectCode)) {
      throw new BadRequestException(`User is not in the project`);
    }

    const { approversTemp, approvers, order, subOrder } =
      await this.getApproval(otPolicy, user.department, user.managerCode);

    if (isEmpty(approvers)) {
      throw new BadRequestException('Approver does not exist');
    }

    await this.checkOtRequestDates(otRequestDates, existOtPlan);

    const totalOtHour = this.calculateTotalOtHour(otRequestDates);

    const expireTime = existOtPlan.configOtPolicy['maxDaysProcess']
      ? moment(new Date()).add(
          existOtPlan.configOtPolicy['maxDaysProcess'],
          'days',
        )
      : null;

    const settingApprover: any = approversTemp.map((approverTemp) => {
      return {
        ...omit(approverTemp, ['id', 'createdAt', 'updatedAt']),
      };
    });

    return await this.entityManager.transaction(async (transaction) => {
      const otRequest = transaction.create(OtRequest, {
        projectCode: existOtPlan.projectCode,
        reason,
        userCode: user.code,
        otPlanId,
        totalOtHour,
        otPolicyCode: existOtPlan.otPolicyCode,
        configOtPolicy: existOtPlan.configOtPolicy,
        expireTime,
        order,
        subOrder,
        flowType: get(existOtPlan, 'otPolicy.flow.flowType'),
        settingApprover,
        totalDate: otRequestDates.length,
      });

      await transaction.save(OtRequest, otRequest);

      const requestApprovers = transaction.create(
        OtRequestApprover,
        approvers.map((approver) => {
          return {
            ...omit(approver, ['id', 'createdAt', 'updatedAt']),
            otRequestId: otRequest.id,
          };
        }),
      );

      await transaction.save(OtRequestApprover, requestApprovers);

      await this.saveOtRequestDates(
        transaction,
        otRequestDates,
        otRequest.id,
        user.code,
      );

      return otRequest;
    });
  }

  async checkOtRequestDates(
    otRequestDates: OtRequestDateDto[],
    otPlan: OtPlan,
  ) {
    for (const otRequestDate of otRequestDates) {
      if (
        otRequestDate.date > new Date(otPlan.endDate) ||
        otRequestDate.date < new Date(otPlan.startDate)
      ) {
        throw new BadRequestException('Ot request date is not valid');
      }
    }
  }

  private calculateTotalOtHour(otRequestDates: OtRequestDateDto[]) {
    let total = 0;

    for (const otRequestDate of otRequestDates) {
      total += +otRequestDate.otHour;
    }

    return total;
  }

  async getApproval(
    otPolicy: OtPolicy,
    departmentCode: string,
    managerCode: string,
  ) {
    const flowType = get(otPolicy, 'flow.flowType', null);
    const approvals = get(otPolicy, 'flow.approvals', null);
    const order = maxBy(approvals, 'order')['order'];
    const subOrder = maxBy(approvals, 'subOrder')['subOrder'];
    const approversInfo = [];
    let approvers;

    if (!approvals) {
      throw new NotFoundException('Setting approval not found');
    }

    if (!flowType) {
      throw new NotFoundException('Flow type not found');
    }

    for (const approval of approvals) {
      approversInfo.push(
        await getApproverInfo(
          approval,
          departmentCode,
          managerCode,
          this.departmentRepository,
          this.userRepository,
        ),
      );
    }

    const approversTemp = approversInfo;

    if (flowType == RequestFlowEnum.SEQUENCE) {
      approvers = approversInfo.filter((item) => {
        if (item.order !== 1) {
          return false;
        }

        if (
          !item.nextByOneApprove &&
          item.approverType == ApproverTypeEnum.SPECIFIC_PERSON
        ) {
          return item.subOrder === 1;
        }
        return item;
      });
    } else {
      approvers = approversInfo;
    }

    return { approversTemp, approvers, order, subOrder };
  }

  async saveOtRequestDates(
    transaction: EntityManager,
    otRequestDates: any[],
    otRequestId: string,
    userCode: string,
  ) {
    const savedOtRequestDates = transaction.create(
      OtRequestDate,
      otRequestDates.map((otRequestDate) => {
        return {
          ...otRequestDate,
          otRequestId,
          userCode,
        };
      }),
    );

    await transaction.save(OtRequestDate, savedOtRequestDates);
  }

  async changeStatus(
    user: AuthUserDto,
    changeOtRequestStatus: ChangeOtRequestStatus,
  ) {
    const { otRequestIds, status } = changeOtRequestStatus;

    for (const id of otRequestIds) {
      const query = this.otRequestRepository
        .createQueryBuilder('otRequest')
        .leftJoinAndMapOne(
          'otRequest.sender',
          User,
          'sender',
          'otRequest.userCode = sender.code',
        )
        .leftJoinAndMapMany(
          'otRequest.approvers',
          OtRequestApprover,
          'approver',
          'otRequest.id = approver.otRequestId AND approver.userCode = :userCode AND approver.status = :status',
          {
            userCode: user.code,
            status: StatusRequestEnum.WAITING,
          },
        )
        .leftJoinAndMapMany(
          'otRequest.dates',
          OtRequestDate,
          'date',
          'otRequest.id = date.otRequestId',
        )
        .where({ id });

      const existOtRequest = await query.getOne();

      if (!existOtRequest) {
        throw new NotFoundException('Request not found');
      }

      const approvers = get(existOtRequest, 'approvers', []);

      const dates = get(existOtRequest, 'dates', []);

      if (!approvers.length) {
        throw new ForbiddenException(`User don't have permissions`);
      }

      if (
        existOtRequest.status !== StatusRequestEnum.WAITING &&
        existOtRequest.status !== StatusRequestEnum.CANCELLED
      ) {
        throw new BadRequestException('Request status is not WAITING');
      }

      await this.entityManager.transaction(async (transaction) => {
        await transaction.save(
          OtRequestApprover,
          approvers.map((approver) => {
            return { ...approver, status };
          }),
        );

        if (status == StatusRequestEnum.APPROVED) {
          const approvedRequest = await this.handleApprovedRequest(
            transaction,
            existOtRequest,
            approvers,
          );

          if (approvedRequest) {
            await this.handleOtBusiness(
              transaction,
              dates,
              user.code,
              user.name,
            );
          }
        }

        if (status == StatusRequestEnum.REJECTED) {
          await this.handleRejectedRequest(transaction, id);
        }
      });
    }
  }

  async handleRejectedRequest(transaction: EntityManager, id: string) {
    await transaction.update(
      OtRequest,
      { id },
      { status: StatusRequestEnum.REJECTED },
    );
  }

  async handleApprovedRequest(
    transaction: EntityManager,
    existOtRequest: OtRequest,
    approvers: any[],
  ) {
    const approversTemp = existOtRequest.settingApprover;

    for (const approver of approvers) {
      await this.updateSameOrder(
        transaction,
        existOtRequest.id,
        approver.order,
        approver.nextByOneApprove,
      );

      await this.updateOtherOrder(transaction, existOtRequest, approver);

      await this.createNewApprover(
        transaction,
        existOtRequest,
        approver,
        approversTemp,
      );
    }

    const checkApproverStatus = await transaction.findOne(OtRequestApprover, {
      where: {
        status: StatusRequestEnum.APPROVED,
        order: existOtRequest.order,
        subOrder: existOtRequest.subOrder,
      },
    });

    if (checkApproverStatus) {
      existOtRequest.status = StatusRequestEnum.APPROVED;
      await transaction.save(OtRequest, existOtRequest);
      return true;
    }
  }

  async updateSameOrder(
    transaction: EntityManager,
    otRequestId: string,
    order: number,
    nextByOneApprove: boolean,
  ) {
    if (nextByOneApprove) {
      await transaction.update(
        OtRequestApprover,
        { otRequestId, order },
        { status: StatusRequestEnum.APPROVED },
      );
    }
  }

  async updateOtherOrder(
    transaction: EntityManager,
    existOtRequest: OtRequest,
    approver: any,
  ) {
    const flowType = existOtRequest.flowType;
    const approveForAll = get(existOtRequest, 'flow.approveForAll', null);

    if (flowType == RequestFlowEnum.PARALLEL) {
      const countOtherStatus = await transaction.count(OtRequestApprover, {
        where: {
          otRequestId: existOtRequest.id,
          order: approver.order,
          status: Not(StatusRequestEnum.APPROVED),
        },
      });

      if (approveForAll && countOtherStatus == 0) {
        return await transaction.update(
          OtRequestApprover,
          { otRequestId: existOtRequest.id },
          { status: StatusRequestEnum.APPROVED },
        );
      }
    }

    if (flowType == RequestFlowEnum.SEQUENCE) {
      const countOtherStatus = await transaction.count(OtRequestApprover, {
        where: {
          otRequestId: existOtRequest.id,
          order: 1,
          status: Not(StatusRequestEnum.APPROVED),
        },
      });

      if (approveForAll && countOtherStatus == 0 && approver.order == 1) {
        return await transaction.update(
          OtRequestApprover,
          { otRequestId: existOtRequest.id },
          { status: StatusRequestEnum.APPROVED },
        );
      }
    }
  }

  async createNewApprover(
    transaction: EntityManager,
    existOtRequest: OtRequest,
    approver: any,
    approversTemp: any[],
  ) {
    if (existOtRequest.flowType == RequestFlowEnum.SEQUENCE) {
      const currentSubOrder = approver.subOrder;
      const currentOrder = approver.order;

      let newApproverArr;

      if (currentSubOrder == null) {
        newApproverArr = approversTemp.filter((item) => {
          if (item.order !== currentOrder + 1) {
            return false;
          }

          if (
            !item.nextByOneApprove &&
            item.approverType == ApproverTypeEnum.SPECIFIC_PERSON
          ) {
            return item.subOrder === 1;
          }

          return item;
        });
      }

      if (currentSubOrder != null) {
        newApproverArr = approversTemp.filter((item) => {
          if (
            item.order == currentOrder &&
            item.subOrder == currentSubOrder + 1 &&
            item.approverType == ApproverTypeEnum.SPECIFIC_PERSON
          ) {
            return item;
          }
        });

        if (!newApproverArr.length) {
          newApproverArr = approversTemp.filter((item) => {
            if (item.order !== currentOrder + 1) {
              return false;
            }

            if (
              !item.nextByOneApprove &&
              item.approverType == ApproverTypeEnum.SPECIFIC_PERSON
            ) {
              return item.subOrder === 1;
            }

            return item;
          });
        }
      }

      const newApprovers = transaction.create(
        OtRequestApprover,
        newApproverArr.map((newApprover) => {
          return { ...newApprover, otRequestId: existOtRequest.id };
        }),
      );

      await transaction.save(OtRequestApprover, newApprovers);
    }
  }

  async handleOtBusiness(
    transaction: EntityManager,
    dates: any[],
    userCode: string,
    username: string,
  ) {
    const data = dates.map((item) => {
      return {
        checkDate: item.date,
        otWorkHour: item.otHour,
        username,
        userCode,
      };
    });

    await transaction.upsert(Timecheck, data, ['checkDate', 'userCode']);
  }

  async update(
    id: string,
    user: AuthUserDto,
    updateOtRequestDto: UpdateOtRequestDto,
  ) {
    const { otRequestDates, reason } = updateOtRequestDto;

    const existOtRequest = await this.otRequestRepository.findOne({
      where: { id, userCode: user.code },
    });

    if (!existOtRequest) {
      throw new NotFoundException('Ot request not found');
    }

    if (existOtRequest.status != StatusRequestEnum.WAITING) {
      throw new BadRequestException('Status ot request is not waiting');
    }

    return await this.entityManager.transaction(async (transaction) => {
      if (otRequestDates) {
        const existOtPlan = await this.otPlanRepository.getOtPlanInfo(
          existOtRequest.otPlanId,
          user.department,
        );

        await this.checkOtRequestDates(otRequestDates, existOtPlan);

        const totalOtHour = this.calculateTotalOtHour(otRequestDates);

        await transaction.delete(OtRequestDate, { otRequestId: id });
        await this.saveOtRequestDates(
          transaction,
          otRequestDates,
          id,
          user.code,
        );

        existOtRequest.totalOtHour = totalOtHour;
        existOtRequest.totalDate = otRequestDates.length;
      }

      existOtRequest.reason = reason;

      return await transaction.save(OtRequest, existOtRequest);
    });
  }

  async getAll(filterOtRequestsDto: FilterOtRequestsDto) {
    return await this.otRequestRepository.getAll(filterOtRequestsDto);
  }

  async getAllMyRequests(
    user: AuthUserDto,
    filterOtRequestsDto: FilterOtRequestsDto,
  ) {
    const conditions = { userCode: user.code };
    return await this.otRequestRepository.getAll(
      filterOtRequestsDto,
      conditions,
    );
  }

  async getAllForApprover(
    user: AuthUserDto,
    filterOtRequestsDto: FilterOtRequestsDto,
  ) {
    const conditions = `approver.userCode = '${user.code}'`;
    return await this.otRequestRepository.getAll(
      filterOtRequestsDto,
      conditions,
    );
  }

  async getRequest(id: string) {
    return await this.otRequestRepository.getRequest(id);
  }

  async getMyRequest(id: string, user: AuthUserDto) {
    const conditions = { userCode: user.code };
    return await this.otRequestRepository.getRequest(id, conditions);
  }
}
