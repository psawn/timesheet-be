import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentRepository } from '../department/department.repository';
import { ProjectUserRepository } from '../project-management/project-user/project-user.repository';
import { TimecheckRepository } from '../timecheck/timecheck.repository';
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
    DepartmentRepository,
    TimecheckRepository,
  ],
  exports: [],
})
export class TimelogModule {}
