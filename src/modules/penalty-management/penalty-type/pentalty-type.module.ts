import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenaltyTypeController } from './penalty-type.controller';
import { PenaltyType } from './penalty-type.entity';
import { PenaltyTypeRepository } from './penalty-type.repository';
import { PenaltyTypeService } from './penalty-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([PenaltyType])],
  controllers: [PenaltyTypeController],
  providers: [PenaltyTypeRepository, PenaltyTypeService],
  exports: [],
})
export class PenaltyTypeModule {}
