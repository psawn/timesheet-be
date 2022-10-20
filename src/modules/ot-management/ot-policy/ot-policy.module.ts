import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtPolicyController } from './ot-policy.controller';
import { OtPolicy } from './ot-policy.entity';
import { OtPolicyRepository } from './ot-policy.repository';
import { OtPolicyService } from './ot-policy.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtPolicy])],
  controllers: [OtPolicyController],
  providers: [OtPolicyService, OtPolicyRepository],
  exports: [],
})
export class OtPolicyModule {}
