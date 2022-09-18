import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsController } from './department.controller';
import { Department } from './department.entity';
import { DepartmentRepository } from './department.repository';
import { DepartmentsService } from './department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentsController],
  providers: [DepartmentRepository, DepartmentsService],
  exports: [],
})
export class DepartmentModule {}
