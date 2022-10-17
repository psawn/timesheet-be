import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelogController } from './timelog.controller';
import { Timelog } from './timelog.entity';
import { TimelogRepository } from './timelog.repository';
import { TimelogService } from './timelog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timelog])],
  controllers: [TimelogController],
  providers: [TimelogService, TimelogRepository],
  exports: [],
})
export class TimelogModule {}
