import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { DepartmentsService } from './department.service';
import { FilterDepartmentsDto } from './dto';

@Auth()
@ApiTags('Department')
@Controller('deparments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

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
    const result = await this.departmentsService.getAll(
      user,
      filterDepartmentsDto,
    );
    return { data: result.items, pagination: result.meta };
  }
}
