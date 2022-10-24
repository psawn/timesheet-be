import { Module } from '@nestjs/common';
import { OtPlanModule } from './ot-plan/ot-plan.module';
import { OtPolicyModule } from './ot-policy/ot-policy.module';
import { OtRequestFlowModule } from './ot-request-flow/ot-request-flow.module';
import { OtRequestModule } from './ot-request/ot-request.module';

@Module({
  imports: [OtPolicyModule, OtPlanModule, OtRequestModule, OtRequestFlowModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OtManagerModule {}
