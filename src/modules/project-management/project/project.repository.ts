import { Injectable } from '@nestjs/common';
import { PaginationConstants } from 'src/common/constants/pagination.enum';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { Department } from 'src/modules/department/department.entity';
import { FilterMyTimelogsDto } from 'src/modules/timelog/dto';
import { Timelog } from 'src/modules/timelog/timelog.entity';
import { User } from 'src/modules/user-management/user/user.entity';
import { EntityManager, ILike } from 'typeorm';
import { ProjectUser } from '../project-user/project-user.entity';
import { CreateProjectDto, FilterProjectDto } from './dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectRepository extends TypeORMRepository<Project> {
  constructor(manager: EntityManager) {
    super(Project, manager);
  }

  async getAll(roleCondition: any, filterProjectDto: FilterProjectDto) {
    const { page, limit, code, name, departmentCode } = filterProjectDto;
    const query = this.createQueryBuilder('project')
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

    if (departmentCode) {
      query.andWhere({ departmentCode: ILike(`%${departmentCode}%`) });
    }

    return this.paginate({ page, limit }, query);
  }

  async findOneByConditions(conditions: any) {
    return await this.findOne(conditions);
  }

  async createProject(user: AuthUserDto, createProjectDto: CreateProjectDto) {
    const project = this.create({
      ...createProjectDto,
      createdBy: user.code,
    });

    return await project.save();
  }

  async getMyProjects(userCode: string, filterProjectDto: FilterProjectDto) {
    const { departmentCode, code, name } = filterProjectDto;
    const page = filterProjectDto.page || PaginationConstants.DEFAULT_PAGE;
    const limit =
      filterProjectDto.limit || PaginationConstants.DEFAULT_LIMIT_ITEM;

    const offset = (page - 1) * limit;

    const query = this.createQueryBuilder('project')
      .leftJoinAndMapMany(
        'project.projectUsers',
        ProjectUser,
        'projectUser',
        'project.code = projectUser.projectCode',
      )
      .leftJoinAndMapOne(
        'project.manager',
        User,
        'manager',
        'project.managerCode = manager.code',
      )
      .select([
        'project.id',
        'project.code',
        'project.name',
        'project.departmentCode',
        'manager.id',
        'manager.code',
        'manager.name',
      ])
      .where({ isActive: true })
      .andWhere('projectUser.userCode = :userCode', { userCode })
      .take(limit)
      .skip(offset);

    if (code) {
      query.andWhere({ code: ILike(`%${code}%`) });
    }

    if (name) {
      query.andWhere({ name: ILike(`%${name}%`) });
    }

    if (departmentCode) {
      query.andWhere({ departmentCode });
    }

    const [items, totalItems] = await query.getManyAndCount();
    return {
      items,
      pagination: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: +limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: +page,
      },
    };
  }

  async getDetaliMyTimelogs(
    userCode: string,
    filterMyTimelogsDto: FilterMyTimelogsDto,
  ) {
    const { page, limit, projectCode, startDate, endDate } =
      filterMyTimelogsDto;

    const query = this.createQueryBuilder('project')
      .leftJoinAndMapMany(
        'project.timelogs',
        Timelog,
        'timelog',
        'project.code = timelog.projectCode AND timelog.checkDate >= :startDate AND timelog.checkDate <= :endDate',
        {
          startDate,
          endDate,
        },
      )
      .select([
        'project.id',
        'project.code',
        'project.name',
        'timelog.id',
        'timelog.logHour',
        'timelog.description',
        'timelog.checkDate',
      ])
      .where('timelog.userCode = :userCode', { userCode });

    if (projectCode) {
      query.andWhere('timelog.projectCode = :projectCode', { projectCode });
    }

    return await this.customPaginate({ page, limit }, query);
  }
}
