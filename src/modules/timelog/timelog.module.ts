import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUserRepository } from '../project-management/project-user/project-user.repository';
import { ProjectRepository } from '../project-management/project/project.repository';
import { UserRepository } from '../user-management/user/user.repository';
import { TimelogController } from './timelog.controller';
import { Timelog } from './timelog.entity';
import { TimelogRepository } from './timelog.repository';
import { TimelogService } from './timelog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timelog])],
  controllers: [TimelogController],
  providers: [
    TimelogService,
    TimelogRepository,
    UserRepository,
    ProjectUserRepository,
    ProjectRepository,
  ],
  exports: [],
})
export class TimelogModule {}
