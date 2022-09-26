import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveBenefitController } from './leave-benefit.controller';
import { LeaveBenefit } from './leave-benefit.entity';
import { LeaveBenefitRepository } from './leave-benefit.repository';
import { LeaveBenefitService } from './leave-benefit.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveBenefit])],
  controllers: [LeaveBenefitController],
  providers: [LeaveBenefitService, LeaveBenefitRepository],
  exports: [],
})
export class DepartmentModule {}
