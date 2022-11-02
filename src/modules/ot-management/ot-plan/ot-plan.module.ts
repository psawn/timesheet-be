import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { ProjectRepository } from 'src/modules/project-management/project/project.repository';
import { OtPolicyRepository } from '../ot-policy/ot-policy.repository';
import { OtPlanController } from './ot-plan.controller';
import { OtPlan } from './ot-plan.entity';
import { OtPlanRepository } from './ot-plan.repository';
import { OtPlanService } from './ot-plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtPlan])],
  controllers: [OtPlanController],
  providers: [
    OtPlanService,
    OtPlanRepository,
    ProjectRepository,
    OtPolicyRepository,
    DepartmentRepository,
  ],
  exports: [],
})
export class OtPlanModule {}
