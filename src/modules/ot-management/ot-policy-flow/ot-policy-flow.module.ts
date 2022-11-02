import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { OtPolicyRepository } from '../ot-policy/ot-policy.repository';
import { OtPolicyFlowController } from './ot-policy-flow.controller';
import { OtPolicyFlow } from './ot-policy-flow.entity';
import { OtPolicyFlowRepository } from './ot-policy-flow.repository';
import { OtPolicyFlowService } from './ot-policy-flow.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtPolicyFlow])],
  controllers: [OtPolicyFlowController],
  providers: [
    OtPolicyFlowService,
    OtPolicyFlowRepository,
    OtPolicyRepository,
    DepartmentRepository,
    UserRepository,
  ],
  exports: [],
})
export class OtPolicyFlowModule {}
