import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveBenefitRepository } from 'src/modules/benefit-management/leave-benefit/leave-benefit.repository';
import { UserLeaveBenefitRepository } from 'src/modules/benefit-management/user-leave-benefit/user-leave-benefit.repository';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { GenWorktimeStgRepository } from 'src/modules/worktime-management/general-worktime-setting/general-worktime-setting.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
    LeaveBenefitRepository,
    UserLeaveBenefitRepository,
    GenWorktimeStgRepository,
    DepartmentRepository,
    UserRoleRepository,
  ],
  exports: [],
})
export class UserModule {}
