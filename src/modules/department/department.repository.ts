import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from 'src/database/typeorm.repository';
import { ILike } from 'typeorm';
import { Department } from './department.entity';
import { FilterDepartmentsDto } from './dto';

@Injectable()
export class DepartmentRepository extends TypeORMRepository<Department> {
  async getAll(roleCondition: any, filterDepartmentsDto: FilterDepartmentsDto) {
    // const { page, limit, ...filterArr } = filterDepartmentsDto;
    const { page, limit, code, name } = filterDepartmentsDto;
    const query = Department.createQueryBuilder('department');

    if (roleCondition) {
      query.andWhere(roleCondition.condtions, roleCondition.params);
    }

    if (code) {
      query.andWhere({ code: ILike(`%${code}%`) });
    }

    if (name) {
      query.andWhere({ name: ILike(`%${name}%`) });
    }

    // for (const property in filterArr) {
    //   query.andWhere(`department.${property} ILIKE '%${filterArr[property]}%'`);
    // }

    return this.paginate({ page, limit }, query);
  }
}
