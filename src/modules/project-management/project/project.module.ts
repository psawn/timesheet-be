import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import { ProjectController } from './project.controller';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [
    ProjectRepository,
    ProjectService,
    DepartmentRepository,
    UserRepository,
  ],
  exports: [],
})
export class ProjectModule {}
