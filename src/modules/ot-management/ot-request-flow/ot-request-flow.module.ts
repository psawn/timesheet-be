import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { OtPolicyRepository } from '../ot-policy/ot-policy.repository';
import { OtRequestFlowController } from './ot-request-flow.controller';
import { OtRequestFlow } from './ot-request-flow.entity';
import { OtRequestFlowRepository } from './ot-request-flow.repository';
import { OtRequestFlowService } from './ot-request-flow.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtRequestFlow])],
  controllers: [OtRequestFlowController],
  providers: [
    OtRequestFlowService,
    OtRequestFlowRepository,
    OtPolicyRepository,
    DepartmentRepository,
    UserRepository,
  ],
  exports: [],
})
export class OtRequestFlowModule {}
