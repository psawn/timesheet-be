import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { DepartmentRepository } from 'src/modules/department/department.repository';
import { UserRepository } from 'src/modules/user-management/user/user.repository';
import {
  UserCodesDto,
  CreateProjectDto,
  FilterProjectDto,
  FilterProjectUserDto,
} from './dto';
import { ProjectRepository } from './project.repository';
import * as _ from 'lodash';
import { In } from 'typeorm';
import { ProjectUserRepository } from '../project-employee/project-employee.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly userRepository: UserRepository,
    private readonly projectUserRepository: ProjectUserRepository,
  ) {}

  async getAll(user: AuthUserDto, filterProjectDto: FilterProjectDto) {
    let permissions = [];
    const params = {};

    if (user.roles.includes(RoleCodeEnum.DIR_MANAGER)) {
      permissions.push('department.manager_code = :managerCode');
      params['managerCode'] = user.code;
    }

    if (user.roles.includes(RoleCodeEnum.DER_MANAGER)) {
      const departments = await this.departmentRepository.findByConditions({
        where: { managerCode: user.code },
      });

      if (!departments.length) return;

      const departmentArr = departments.map((item) => {
        return item.code;
      });

      permissions.push('project.department_code IN(:...departmentCode)');
      params['departmentCode'] = departmentArr;
    }

    if (user.roles.includes(RoleCodeEnum.ADMIN)) {
      permissions = null;
    }

    const roleCondition = permissions
      ? {
          condtions: permissions.join(' OR '),
          params,
        }
      : null;

    return await this.projectRepository.getAll(roleCondition, filterProjectDto);
  }

  async createProject(user: AuthUserDto, createProjectDto: CreateProjectDto) {
    const { code, departmentCode, managerCode } = createProjectDto;

    const existProject = await this.projectRepository.findOneByConditions({
      where: { code },
    });

    if (existProject) {
      throw new BadRequestException('Project already exists');
    }

    const existDepartment = await this.departmentRepository.findOneByConditions(
      {
        where: { code: departmentCode },
      },
    );

    if (!existDepartment) {
      throw new NotFoundException('Department not found');
    }

    const existUser = await this.userRepository.findOneWithRoles({
      code: managerCode,
    });

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    const roleCheckArr = _.intersection(existUser['roles'], [
      RoleCodeEnum.DER_MANAGER,
      RoleCodeEnum.DIR_MANAGER,
    ]);

    if (!roleCheckArr.length) {
      throw new BadRequestException('User do not have required role');
    }

    return await this.projectRepository.createProject(user, createProjectDto);
  }

  async addUsers(user: AuthUserDto, code: string, userCodesDto: UserCodesDto) {
    const { userCodes } = userCodesDto;

    const existProject = await this.projectRepository.findOneByConditions({
      where: { managerCode: user.code, code },
    });

    if (!existProject) {
      throw new NotFoundException('Project not found');
    }

    const countUser = await this.userRepository.count({
      where: { code: In(userCodes) },
    });

    if (countUser != userCodes.length) {
      throw new NotFoundException('User not found');
    }

    const countUserInProject = await this.projectUserRepository.count({
      where: { projectCode: code, userCode: In(userCodes) },
    });

    if (countUserInProject) {
      throw new NotFoundException('User already in project');
    }

    await this.projectUserRepository.addUsers(code, userCodes);
  }

  async deleteUsers(
    user: AuthUserDto,
    code: string,
    userCodesDto: UserCodesDto,
  ) {
    const { userCodes } = userCodesDto;

    const existProject = await this.projectRepository.findOneByConditions({
      where: { managerCode: user.code, code },
    });

    if (!existProject) {
      throw new NotFoundException('Project not found');
    }

    await this.projectUserRepository.deleteUsers(code, userCodes);
  }

  async getMyProjects(user: AuthUserDto, filterProjectDto: FilterProjectDto) {
    return await this.projectRepository.getMyProjects(
      user.code,
      filterProjectDto,
    );
  }

  async getUserInProjects(
    user: AuthUserDto,
    code: string,
    filterProjectUserDto: FilterProjectUserDto,
  ) {
    return await this.userRepository.getUserInProjects(
      user.code,
      code,
      filterProjectUserDto,
    );
  }
}
