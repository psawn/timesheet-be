import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
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
  ChangeStatusOtPlanDto,
  CreateOtPlan,
  FilterOtPlanDto,
  UpdateOtPlanDto,
} from './dto';
import { OtPlanService } from './ot-plan.service';

@Auth()
@ApiTags('OtPlan')
@Controller('ot-plans')
export class OtPlanController {
  constructor(private readonly otPlanService: OtPlanService) {}

  @Get()
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Get all ot plans successfully.',
  })
  @customDecorators()
  async getAll(
    @AuthUser() user: AuthUserDto,
    @Query() filterOtPlanDto: FilterOtPlanDto,
  ) {
    const { items, pagination } = await this.otPlanService.getAll(
      user,
      filterOtPlanDto,
    );
    return { data: items, pagination };
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create ot plan successfully.',
  })
  @customDecorators()
  async createOtPlan(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createOtPlan: CreateOtPlan,
  ) {
    const otPlan = await this.otPlanService.createOtPlan(user, createOtPlan);
    return { data: otPlan };
  }

  @Patch('/:id')
  @ApiResponse({
    status: 200,
    description: 'Update ot plan successfully.',
  })
  @customDecorators()
  async updateOtPlan(
    @AuthUser() user: AuthUserDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateOtPlanDto: UpdateOtPlanDto,
  ) {
    const otPlan = await this.otPlanService.updateOtPlan(
      user,
      id,
      updateOtPlanDto,
    );
    return { data: otPlan };
  }

  @Roles(RoleCodeEnum.DER_MANAGER)
  @Put('/change-status')
  @ApiResponse({
    status: 200,
    description: 'Change status ot plans successfully.',
  })
  @customDecorators()
  async changeStatus(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) changeStatusOtPlanDto: ChangeStatusOtPlanDto,
  ) {
    await this.otPlanService.changeStatus(user, changeStatusOtPlanDto);
    return { data: null };
  }
}
