import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayBenefitRepository } from '../benefit-management/holiday-benefit/holiday-benefit.repository';
import { RemoteWorkingRepository } from '../request-management/remote-working/remote-working.repository';
import { UserRepository } from '../user-management/user/user.repository';
import { GenWorktimeRepository } from '../worktime-management/general-worktime/general-worktime.repository';
import { TimecheckController } from './timecheck.controller';
import { Timecheck } from './timecheck.entity';
import { TimecheckRepository } from './timecheck.repository';
import { TimecheckService } from './timecheck.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timecheck])],
  controllers: [TimecheckController],
  providers: [
    TimecheckService,
    TimecheckRepository,
    UserRepository,
    RemoteWorkingRepository,
    GenWorktimeRepository,
    HolidayBenefitRepository,
  ],
  exports: [],
})
export class TimecheckModule {}
