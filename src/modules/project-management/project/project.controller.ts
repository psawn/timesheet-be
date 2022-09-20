import { Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreateProjectDto, FilterProjectDto } from './dto';
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

  @Post()
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Create project successfully.',
  })
  @customDecorators()
  async createProject(
    @AuthUser() user: AuthUserDto,
    @Query(ValidationPipe) createProjectDto: CreateProjectDto,
  ) {
    const project = await this.projectService.createProject(
      user,
      createProjectDto,
    );
    return { data: project.id };
  }
}
