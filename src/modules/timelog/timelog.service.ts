import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { get, groupBy, omit, orderBy } from 'lodash';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { DepartmentRepository } from '../department/department.repository';
import { ProjectUserRepository } from '../project-management/project-user/project-user.repository';
import { TimecheckRepository } from '../timecheck/timecheck.repository';
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
    private readonly departmentRepository: DepartmentRepository,
    private readonly timecheckRepository: TimecheckRepository,
  ) {}

  async getAll(user: AuthUserDto, filterTimelogsDto: FilterTimelogsDto) {
    const roleCondition = await this.genTimelogConditionByRole(user);

    const { items, pagination } = await this.userRepository.getAllTimelogs(
      roleCondition,
      filterTimelogsDto,
    );

    const summary = this.calculateTimelogs(items);

    return { summary, pagination };
  }

  async getUserTimelogs(user: AuthUserDto, userCode: string, checkDate: Date) {
    const roleCondition = await this.genTimelogConditionByRole(user);

    const filterTimelogsDto = new FilterTimelogsDto();

    filterTimelogsDto.userCode = userCode;
    filterTimelogsDto.startDate = checkDate;
    filterTimelogsDto.endDate = checkDate;

    const { items } = await this.userRepository.getAllTimelogs(
      roleCondition,
      filterTimelogsDto,
    );

    return get(items[0], 'timelogs', []);
  }

  async create(user: AuthUserDto, createTimelogDto: CreateTimelogDto) {
    const { projectCode, checkDate } = createTimelogDto;

    const existUserInProject = await this.projectUserRepository.findOne({
      where: { projectCode, userCode: user.code, isActive: true },
    });

    if (!existUserInProject) {
      throw new NotFoundException('Not found user in project');
    }

    if (checkDate >= new Date()) {
      throw new BadRequestException(`Can't log work in future`);
    }

    const existTimecheck = await this.timecheckRepository.findOne({
      where: { checkDate, userCode: user.code },
    });

    if (!existTimecheck) {
      throw new BadRequestException('Need check date to log work');
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

  async getMyTimelogs(
    userCode: string,
    filterDetailTimelogsDto: FilterDetailTimelogsDto,
  ) {
    const { startDate, endDate } = filterDetailTimelogsDto;
    const filterTimelogsDto = new FilterTimelogsDto();

    filterTimelogsDto.userCode = userCode;
    filterTimelogsDto.startDate = startDate;
    filterTimelogsDto.endDate = endDate;

    const { items } = await this.userRepository.getAllTimelogs(
      null,
      filterTimelogsDto,
    );

    const summary = this.calculateTimelogs(items);

    return summary;
  }

  async getDetailMyTimelogs(userCode: string, checkDate: Date) {
    const data = await this.timelogRepository.find({
      where: { checkDate, userCode },
      select: ['id', 'projectCode', 'logHour', 'description', 'checkDate'],
    });

    return data;
  }

  private async genTimelogConditionByRole(user: AuthUserDto) {
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

    return roleCondition;
  }

  private calculateTimelogs(items: any[]) {
    const summary = items.map((item) => {
      const timelogs = orderBy(
        get(item, 'timelogs', []),
        ['checkDate'],
        ['asc'],
      );
      const grouped = groupBy(timelogs, (timelogs) => timelogs.checkDate);

      const sumTimelogs = [];

      for (const property in grouped) {
        const obj = {};

        obj[property] = grouped[property].reduce((total, item) => {
          return total + item.logHour;
        }, 0);

        sumTimelogs.push(obj);
      }

      return {
        ...omit(item, ['timelogs']),
        timelogs: sumTimelogs,
      };
    });

    return summary;
  }
}
