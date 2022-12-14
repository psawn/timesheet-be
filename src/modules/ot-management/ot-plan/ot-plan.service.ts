import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { ProjectRepository } from 'src/modules/project-management/project/project.repository';
import { In } from 'typeorm';
import { OtPolicyRepository } from '../ot-policy/ot-policy.repository';
import {
  ChangeStatusOtPlanDto,
  CreateOtPlan,
  FilterOtPlanDto,
  UpdateOtPlanDto,
} from './dto';
import { OtPlanRepository } from './ot-plan.repository';

@Injectable()
export class OtPlanService {
  constructor(
    private readonly otPlanRepository: OtPlanRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly otPolicyRepository: OtPolicyRepository,
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async getAll(user: AuthUserDto, filterOtPlanDto: FilterOtPlanDto) {
    // for check array contains one value
    // const ckDerOrDirMng = some(user.roles, (role) =>
    //   includes([RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER], role),
    // );
    let conditions = {};

    if (
      user.roles.includes(RoleCodeEnum.DER_MANAGER) ||
      user.roles.includes(RoleCodeEnum.DIR_MANAGER)
    ) {
      conditions = { createdBy: user.code };
    }

    if (user.roles.includes(RoleCodeEnum.ADMIN)) {
      conditions = null;
    }

    return await this.otPlanRepository.getAll(conditions, filterOtPlanDto);
  }

  async createOtPlan(user: AuthUserDto, createOtPlan: CreateOtPlan) {
    const { projectCode, startDate, endDate, otPolicyCode } = createOtPlan;

    const existManagerProject = await this.projectRepository.findOne({
      where: { code: projectCode, managerCode: user.code },
    });

    const existOtPolicy = await this.otPolicyRepository.findOne({
      where: { code: otPolicyCode, isActive: true },
    });

    if (!existManagerProject) {
      throw new NotFoundException(
        `Project not found or user don't manage project`,
      );
    }

    const departmentManager = await this.departmentRepository.findOne({
      where: { isActive: true, code: existManagerProject.departmentCode },
    });

    if (!departmentManager) {
      throw new NotFoundException('Department manager not found');
    }

    if (startDate > endDate) {
      throw new BadRequestException(
        'End date need to be grater than start date',
      );
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start time is in the past');
    }

    if (!existOtPolicy) {
      throw new NotFoundException('Ot policy not found');
    }

    const configOtPolicy: any = omit(existOtPolicy, [
      'id',
      'createdAt',
      'updatedAt',
      'createdBy',
      'updatedBy',
    ]);

    const otPlan = this.otPlanRepository.create({
      ...createOtPlan,
      createdBy: user.code,
      otPolicyCode,
      configOtPolicy,
      approverCode: departmentManager.managerCode,
    });

    return await this.otPlanRepository.save(otPlan);
  }

  async updateOtPlan(
    user: AuthUserDto,
    id: string,
    updateOtPlanDto: UpdateOtPlanDto,
  ) {
    const existOtPlan = await this.otPlanRepository.findOne({
      where: { id, createdBy: user.code },
    });

    if (!existOtPlan) {
      throw new NotFoundException('Ot plan not found');
    }

    Object.assign(existOtPlan, updateOtPlanDto);

    if (existOtPlan.startDate > existOtPlan.endDate) {
      throw new BadRequestException(
        'End date need to be grater than start date',
      );
    }

    if (existOtPlan.startDate < new Date()) {
      throw new BadRequestException('Start time is in the past');
    }

    return await this.otPlanRepository.save(existOtPlan);
  }

  async changeStatus(
    user: AuthUserDto,
    changeStatusOtPlanDto: ChangeStatusOtPlanDto,
  ) {
    const { otPlanIds, status } = changeStatusOtPlanDto;

    const countOtPlan = await this.otPlanRepository.count({
      where: { id: In(otPlanIds), approverCode: user.code },
    });

    if (countOtPlan != otPlanIds.length) {
      throw new NotFoundException('Ot plan is not found');
    }

    await this.otPlanRepository.update({ id: In(otPlanIds) }, { status });
  }
}
