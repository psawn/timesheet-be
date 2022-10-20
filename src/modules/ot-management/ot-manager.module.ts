import { Module } from '@nestjs/common';
import { OtPlanModule } from './ot-plan/ot-plan.module';
import { OtPolicyModule } from './ot-policy/ot-policy.module';

@Module({
  imports: [OtPolicyModule, OtPlanModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OtManagerModule {}
