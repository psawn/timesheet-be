import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimecheckRepository } from 'src/modules/timecheck/timecheck.repository';
import { TimelogRepository } from 'src/modules/timelog/timelog.repository';
import { PenaltyTypeRepository } from '../penalty-type/penalty-type.repository';
import { PenaltyController } from './penalty.controller';
import { Penalty } from './penalty.entity';
import { PenaltyRepository } from './penalty.repository';
import { PenaltyService } from './penalty.service';

@Module({
  imports: [TypeOrmModule.forFeature([Penalty])],
  controllers: [PenaltyController],
  providers: [
    PenaltyRepository,
    PenaltyTypeRepository,
    TimecheckRepository,
    TimelogRepository,
    PenaltyService,
  ],
  exports: [],
})
export class PenaltyModule {}
