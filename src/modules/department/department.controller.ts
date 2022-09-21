import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, FilterDepartmentsDto } from './dto';

@Auth()
@ApiTags('Department')
@Controller('deparments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Get departments successfully.',
  })
  @customDecorators()
  async getAll(
    @AuthUser() user: AuthUserDto,
    @Query() filterDepartmentsDto: FilterDepartmentsDto,
  ) {
    const result = await this.departmentService.getAll(
      user,
      filterDepartmentsDto,
    );
    return { data: result.items, pagination: result.meta };
  }

  @Post()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create department successfully.',
  })
  @customDecorators()
  async createDepartment(
    @AuthUser() user: AuthUserDto,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    const department = await this.departmentService.createDepartment(
      user,
      createDepartmentDto,
    );
    return { data: department.code };
  }
}
