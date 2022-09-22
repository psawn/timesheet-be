import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { PolicyRepository } from '../policy/policy.repository';
import { PolicyApproverController } from './policy-approver.controller';
import { PolicyApproves } from './policy-approver.entity';
import { PolicyApproverRepository } from './policy-approver.repository';
import { PolicyApproverService } from './policy-approver.service';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyApproves])],
  controllers: [PolicyApproverController],
  providers: [
    PolicyApproverService,
    PolicyApproverRepository,
    PolicyRepository,
    DepartmentRepository,
    UserRepository,
  ],
  exports: [],
})
export class PolicyApproverModule {}
