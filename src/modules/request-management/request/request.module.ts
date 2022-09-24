import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestController } from './request.controller';
import { TimeRequest } from './request.entity';
import { RequestRepository } from './request.repository';
import { RequestService } from './request.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeRequest])],
  controllers: [RequestController],
  providers: [RequestService, RequestRepository],
  exports: [],
})
export class RequestModule {}
