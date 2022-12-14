import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import {
  CreateProjectDto,
  FilterProjectDto,
  FilterProjectUserDto,
  UserCodesDto,
} from './dto';
import { ProjectService } from './project.service';

@Auth()
@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Get projects successfully.',
  })
  @customDecorators()
  async getAll(
    @AuthUser() user: AuthUserDto,
    @Query(ValidationPipe) filterProjectDto: FilterProjectDto,
  ) {
    const result = await this.projectService.getAll(user, filterProjectDto);
    return { data: result.items, pagination: result.meta };
  }

  @Get('/my-project')
  @ApiResponse({
    status: 200,
    description: 'Get my projects successfully.',
  })
  @customDecorators()
  async getMyProjects(
    @AuthUser() user: AuthUserDto,
    @Query(ValidationPipe) filterProjectDto: FilterProjectDto,
  ) {
    const { items, pagination } = await this.projectService.getMyProjects(
      user,
      filterProjectDto,
    );
    return { data: items, pagination };
  }

  @Get('/:code/user')
  @ApiResponse({
    status: 200,
    description: `Get project's user successfully.`,
  })
  @customDecorators()
  async getUserInProjects(
    @AuthUser() user: AuthUserDto,
    @Param('code') code: string,
    @Query(ValidationPipe) filterProjectUserDto: FilterProjectUserDto,
  ) {
    const { items, pagination } = await this.projectService.getUserInProjects(
      user,
      code,
      filterProjectUserDto,
    );
    return { data: items, pagination };
  }

  @Post()
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Create project successfully.',
  })
  @customDecorators()
  async createProject(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createProjectDto: CreateProjectDto,
  ) {
    const project = await this.projectService.createProject(
      user,
      createProjectDto,
    );
    return { data: project.code };
  }

  @Post('/:code/add-users')
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Add users to project successfully.',
  })
  @customDecorators()
  async addUsers(
    @AuthUser() user: AuthUserDto,
    @Param('code') code: string,
    @Body(ValidationPipe) userCodesDto: UserCodesDto,
  ) {
    await this.projectService.addUsers(user, code, userCodesDto);
    return { data: null };
  }

  @Post('/:code/delete-users')
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Delete users to project successfully.',
  })
  @customDecorators()
  async deleteUsers(
    @AuthUser() user: AuthUserDto,
    @Param('code') code: string,
    @Body(ValidationPipe) userCodesDto: UserCodesDto,
  ) {
    await this.projectService.deleteUsers(user, code, userCodesDto);
    return { data: null };
  }
}
