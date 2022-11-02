import { Module } from '@nestjs/common';
import { OtPlanModule } from './ot-plan/ot-plan.module';
import { OtPolicyModule } from './ot-policy/ot-policy.module';
import { OtPolicyFlowModule } from './ot-policy-flow/ot-policy-flow.module';
import { OtRequestModule } from './ot-request/ot-request.module';

@Module({
  imports: [OtPolicyModule, OtPlanModule, OtRequestModule, OtPolicyFlowModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OtManagerModule {}
