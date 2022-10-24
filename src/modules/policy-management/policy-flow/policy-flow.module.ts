import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { PolicyRepository } from '../policy/policy.repository';
import { PolicyFlowController } from './policy-flow.controller';
import { PolicyFlow } from './policy-flow.entity';
import { PolicyFlowRepository } from './policy-flow.repository';
import { PolicyFlowService } from './policy-flow.service';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyFlow])],
  controllers: [PolicyFlowController],
  providers: [
    PolicyFlowService,
    PolicyFlowRepository,
    PolicyRepository,
    DepartmentRepository,
    UserRepository,
  ],
  exports: [],
})
export class PolicyFlowModule {}
