import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as moment from 'moment';
import { StatusRequestEnum } from 'src/common/constants/status-request.enum';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { ProjectUserRepository } from 'src/modules/project-management/project-user/project-user.repository';
import { EntityManager } from 'typeorm';
import { OtPlan } from '../ot-plan/ot-plan.entity';
import { OtPlanRepository } from '../ot-plan/ot-plan.repository';
import { OtRequestDateDto } from '../ot-request-date/dto';
import { OtRequestDate } from '../ot-request-date/ot-request-date.entity';
import { CreateOtRequestDto } from './dto/create-ot-request.dto';
import { OtRequest } from './ot-request.entity';
import { OtRequestRepository } from './ot-request.repository';

@Injectable()
export class OtRequestService {
  constructor(
    private readonly otRequestRepository: OtRequestRepository,
    private readonly otPlanRepository: OtPlanRepository,
    private readonly projectUserRepository: ProjectUserRepository,
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

    const existOtPlan = await this.otPlanRepository.findOneWithPolicy(otPlanId);

    if (!existOtPlan) {
      throw new NotFoundException('Ot plan not found');
    }

    if (existOtPlan.status !== StatusRequestEnum.APPROVED) {
      throw new BadRequestException('Ot plan status is not approved');
    }

    if (!projects.includes(existOtPlan.projectCode)) {
      throw new BadRequestException(`User is not in the project`);
    }

    await this.checkOtRequestDates(otRequestDates, existOtPlan);

    const totalOtHour = this.calculateTotalOtHour(otRequestDates);

    const otRequest = this.otRequestRepository.create({
      projectCode: existOtPlan.projectCode,
      reason,
      userCode: user.code,
      otPlanId,
      totalOtHour,
      otPolicyCode: existOtPlan.otPolicyCode,
      configOtPolicy: existOtPlan.configOtPolicy,
      expireTime: existOtPlan.configOtPolicy['maxDaysProcess']
        ? moment(new Date()).add(
            existOtPlan.configOtPolicy['maxDaysProcess'],
            'days',
          )
        : null,
    });

    await this.entityManager.transaction(async (transaction) => {
      await transaction.save(OtRequest, otRequest);

      const savedOtRequestDates = transaction.create(
        OtRequestDate,
        otRequestDates.map((otRequestDate) => {
          return {
            ...otRequestDate,
            otRequestId: otRequest.id,
            userCode: user.code,
          };
        }),
      );

      await transaction.save(OtRequestDate, savedOtRequestDates);
    });

    return otRequest;
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
}
