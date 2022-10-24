import { Module } from '@nestjs/common';
import { PolicyFlowModule } from './policy-flow/policy-flow.module';
import { PolicyModule } from './policy/policy.module';

@Module({
  imports: [PolicyModule, PolicyFlowModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PolicyManagerModule {}
