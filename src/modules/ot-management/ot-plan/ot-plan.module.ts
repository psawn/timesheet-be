import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtPlanController } from './ot-plan.controller';
import { OtPlanRepository } from './ot-plan.repository';
import { OtPlanService } from './ot-plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [OtPlanController],
  providers: [OtPlanService, OtPlanRepository],
  exports: [],
})
export class OtPlanModule {}
