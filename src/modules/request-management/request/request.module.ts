import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayBenefitRepository } from 'src/modules/benefit-management/holiday-benefit/holiday-benefit.repository';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { PolicyRepository } from 'src/modules/policy-management/policy/policy.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { GenWorktimeStgRepository } from 'src/modules/worktime-management/general-worktime-setting/general-worktime-setting.repository';
import { SharedModule } from 'src/shared/shared.module';
import { RequestController } from './request.controller';
import { TimeRequest } from './request.entity';
import { RequestRepository } from './request.repository';
import { RequestService } from './request.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeRequest]), SharedModule],
  controllers: [RequestController],
  providers: [
    RequestService,
    RequestRepository,
    PolicyRepository,
    GenWorktimeStgRepository,
    HolidayBenefitRepository,
    DepartmentRepository,
    UserRepository,
  ],
  exports: [],
})
export class RequestModule {}
