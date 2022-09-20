import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { Department } from 'src/modules/department/department.entity';
import { User } from 'src/modules/user-management/user/user.entity';
import { ILike } from 'typeorm';
import { CreateProjectDto, FilterProjectDto } from './dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectRepository extends TypeORMRepository<Project> {
  async getAll(roleCondition: any, filterProjectDto: FilterProjectDto) {
    const { page, limit, code, name, deparmentCode } = filterProjectDto;
    const query = Project.createQueryBuilder('project')
      .leftJoinAndMapOne(
        'project.manager',
        User,
        'manager',
        'project.manager_code = manager.code',
      )
      .leftJoinAndMapOne(
        'project.department',
        Department,
        'department',
        'project.department_code = department.code',
      )
      .leftJoinAndMapOne(
        'project.createdBy',
        User,
        'createdBy',
        'department.createdBy = createdBy.code',
      )
      .leftJoinAndMapOne(
        'project.updatedBy',
        User,
        'updatedBy',
        'department.updatedBy = updatedBy.code',
      )
      .select([
        'project.id',
        'project.code',
        'project.name',
        'project.createdAt',
        'project.updatedAt',
        'manager.id',
        'manager.code',
        'manager.name',
        'department.id',
        'department.code',
        'department.name',
        'createdBy.id',
        'createdBy.code',
        'createdBy.name',
        'updatedBy.id',
        'updatedBy.code',
        'updatedBy.name',
      ]);

    if (roleCondition) {
      query.andWhere(roleCondition.condtions, roleCondition.params);
    }

    if (code) {
      query.andWhere({ code: ILike(`%${code}%`) });
    }

    if (name) {
      query.andWhere({ name: ILike(`%${name}%`) });
    }

    if (deparmentCode) {
      query.andWhere({ departmentCode: ILike(`%${deparmentCode}%`) });
    }

    return this.paginate({ page, limit }, query);
  }

  async findOneByConditions(conditions: any) {
    return await Department.findOne(conditions);
  }

  async createProject(user: AuthUserDto, createProjectDto: CreateProjectDto) {
    const project = Project.create({
      ...createProjectDto,
      createdBy: user.code,
    });

    return await project.save();
  }
}
