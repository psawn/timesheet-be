import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { ProjectUserRepository } from '../project-management/project-user/project-user.repository';
import { ProjectRepository } from '../project-management/project/project.repository';
import { UserRepository } from '../user-management/user/user.repository';
import {
  CreateTimelogDto,
  DeleteTimelogDto,
  FilterTimelogsDto,
  FilterMyTimelogsDto,
} from './dto';
import { TimelogRepository } from './timelog.repository';

@Injectable()
export class TimelogService {
  constructor(
    private readonly timelogRepository: TimelogRepository,
    private readonly userRepository: UserRepository,
    private readonly projectUserRepository: ProjectUserRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async getAll(filterTimelogsDto: FilterTimelogsDto) {
    const data = await this.userRepository.getAllTimelogs(filterTimelogsDto);
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

  async getDetaliMyTimelogs(
    user: AuthUserDto,
    filterMyTimelogsDto: FilterMyTimelogsDto,
  ) {
    const data = await this.projectRepository.getDetaliMyTimelogs(
      user.code,
      filterMyTimelogsDto,
    );
    return data;
  }
}
