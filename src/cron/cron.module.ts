import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserLeaveBenefitRepository } from 'src/modules/benefit-management/user-leave-benefit/user-leave-benefit.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService, UserLeaveBenefitRepository, UserRepository],
})
export class CronModule {}
