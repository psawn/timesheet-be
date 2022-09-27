import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyRepository } from 'src/modules/policy-management/policy/policy.repository';
import { RequestController } from './request.controller';
import { TimeRequest } from './request.entity';
import { RequestRepository } from './request.repository';
import { RequestService } from './request.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeRequest])],
  controllers: [RequestController],
  providers: [RequestService, RequestRepository, PolicyRepository],
  exports: [],
})
export class RequestModule {}
