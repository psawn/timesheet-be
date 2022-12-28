import { Module } from '@nestjs/common';
import { PenaltyTypeModule } from './penalty-type/pentalty-type.module';
import { PenaltyModule } from './penalty/penalty.module';

@Module({
  imports: [PenaltyTypeModule, PenaltyModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PenaltyManagementModule {}
