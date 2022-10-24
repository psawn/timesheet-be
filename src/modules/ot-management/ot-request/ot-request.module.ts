import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUserRepository } from 'src/modules/project-management/project-user/project-user.repository';
import { OtPlanRepository } from '../ot-plan/ot-plan.repository';
import { OtRequestController } from './ot-request.controller';
import { OtRequest } from './ot-request.entity';
import { OtRequestRepository } from './ot-request.repository';
import { OtRequestService } from './ot-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtRequest])],
  controllers: [OtRequestController],
  providers: [
    OtRequestService,
    OtRequestRepository,
    OtPlanRepository,
    ProjectUserRepository,
  ],
  exports: [],
})
export class OtRequestModule {}
