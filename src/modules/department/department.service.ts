import { BadRequestException, Injectable } from '@nestjs/common';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto, FilterDepartmentsDto } from './dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async getAll(user: AuthUserDto, filterDepartmentsDto: FilterDepartmentsDto) {
    let permissions = [];
    const params = {};

    if (user.roles.includes(RoleCodeEnum.DER_MANAGER)) {
      permissions.push('department.manager_code = :managerCode');
      params['managerCode'] = user.code;
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

    return await this.departmentRepository.getAll(
      roleCondition,
      filterDepartmentsDto,
    );
  }

  async createDepartment(
    user: AuthUserDto,
    createDepartmentDto: CreateDepartmentDto,
  ) {
    const existDepartment = await this.departmentRepository.findOneByConditions(
      { where: { code: createDepartmentDto.code } },
    );

    if (existDepartment) {
      throw new BadRequestException('Department already exists');
    }

    return await this.departmentRepository.createDepartment(
      user,
      createDepartmentDto,
    );
  }
}
