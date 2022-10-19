import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { DepartmentRepository } from '../department/department.repository';
import { ProjectUserRepository } from '../project-management/project-user/project-user.repository';
import { ProjectRepository } from '../project-management/project/project.repository';
import { UserRepository } from '../user-management/user/user.repository';
import {
  CreateTimelogDto,
  DeleteTimelogDto,
  FilterTimelogsDto,
  FilterDetailTimelogsDto,
} from './dto';
import { TimelogRepository } from './timelog.repository';

@Injectable()
export class TimelogService {
  constructor(
    private readonly timelogRepository: TimelogRepository,
    private readonly userRepository: UserRepository,
    private readonly projectUserRepository: ProjectUserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async getAll(user: AuthUserDto, filterTimelogsDto: FilterTimelogsDto) {
    let permissions = [];
    const params = {};

    if (user.roles.includes(RoleCodeEnum.DER_MANAGER)) {
      const departments = await this.departmentRepository.find({
        where: { managerCode: user.code },
      });
      const departmentArr = departments.map((department) => {
        return department.code;
      });
      permissions.push('user.department IN (:...departmentArr)');
      params['departmentArr'] = departmentArr;
      // permissions.push('department.manager_code = :managerCode');
      // params['managerCode'] = user.code;
    }

    if (user.roles.includes(RoleCodeEnum.DIR_MANAGER)) {
      permissions.push('user.managerCode = :managerCode');
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

    const data = await this.userRepository.getAllTimelogs(
      roleCondition,
      filterTimelogsDto,
    );
    return data;
  }

  async create(user: AuthUserDto, createTimelogDto: CreateTimelogDto) {
    const { projectCode, checkDate } = createTimelogDto;

    const existUserInProject =
      await this.projectUserRepository.findUserInProject(
        projectCode,
        user.code,
      );

    if (!existUserInProject) {
      throw new NotFoundException('Not found user in project');
    }

    if (checkDate >= new Date()) {
      throw new BadRequestException(`Can't log work in future`);
    }

    return await this.timelogRepository.customeUpsert(
      {
        projectCode,
        userCode: user.code,
        checkDate,
      },
      {
        ...createTimelogDto,
        userCode: user.code,
      },
    );
  }

  async delete(user: AuthUserDto, deleteTimelogDto: DeleteTimelogDto) {
    const { checkDate, projectCode } = deleteTimelogDto;
    return await this.timelogRepository.delete({
      userCode: user.code,
      checkDate,
      projectCode,
    });
  }

  async getDetaliTimelogs(
    userCode: string,
    filterDetailTimelogsDto: FilterDetailTimelogsDto,
    user: AuthUserDto,
  ) {
    await this.ckTimelogPermission(userCode, user);

    const data = await this.projectRepository.getDetailTimelogs(
      userCode,
      filterDetailTimelogsDto,
    );
    return data;
  }

  async getMyTimelogs(
    userCode: string,
    filterDetailTimelogsDto: FilterDetailTimelogsDto,
  ) {
    const data = await this.projectRepository.getDetailTimelogs(
      userCode,
      filterDetailTimelogsDto,
    );
    return data;
  }

  async ckTimelogPermission(userCode: string, user: AuthUserDto) {
    if (user.roles.includes(RoleCodeEnum.ADMIN)) {
      return;
    }

    if (user.roles.includes(RoleCodeEnum.DER_MANAGER)) {
      const ckTimelogDerMng = await this.userRepository.ckTimelogDerMng(
        userCode,
        user.code,
      );

      if (ckTimelogDerMng) {
        return;
      }
    }

    if (user.roles.includes(RoleCodeEnum.DIR_MANAGER)) {
      const ckTimelogDirMng = await this.userRepository.findOne({
        where: { managerCode: user.code },
      });

      if (ckTimelogDirMng) {
        return;
      }
    }

    throw new ForbiddenException('You do not have permission');
  }
}
