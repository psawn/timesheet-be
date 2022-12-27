import { Module } from '@nestjs/common';
import { PenaltyTypeModule } from './penalty-type/pentalty-type.module';

@Module({
  imports: [PenaltyTypeModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PenaltyManagementModule {}
