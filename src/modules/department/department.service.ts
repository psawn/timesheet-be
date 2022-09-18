import { Injectable } from '@nestjs/common';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { DepartmentRepository } from './department.repository';
import { FilterDepartmentsDto } from './dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async getAll(user: AuthUserDto, filterDepartmentsDto: FilterDepartmentsDto) {
    let permissions = [];
    const params = {};

    if (user.roles.includes(RoleCodeEnum.DER_MANAGER)) {
      permissions.push('department.manager = :manager');
      params['manager'] = user.code;
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
}
