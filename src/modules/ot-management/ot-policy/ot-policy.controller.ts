import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Patch,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreateOtPolicyDto, FilterOtPolicyDto, UpdateOtPolicyDto } from './dto';
import { OtPolicyService } from './ot-policy.service';

@Auth()
@ApiTags('OtPolicy')
@Controller('ot-policies')
export class OtPolicyController {
  constructor(private readonly otPolicyService: OtPolicyService) {}

  @Get()
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Get all ot policies successfully.',
  })
  @customDecorators()
  async getAll(@Query() filterOtPolicyDto: FilterOtPolicyDto) {
    const { items, pagination } = await this.otPolicyService.getAll(
      filterOtPolicyDto,
    );
    return { data: items, pagination };
  }

  @Post()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create  ot policy successfully.',
  })
  @customDecorators()
  async create(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createOtPolicyDto: CreateOtPolicyDto,
  ) {
    const otPolicy = await this.otPolicyService.createOtPolicy(
      user,
      createOtPolicyDto,
    );
    return { data: otPolicy };
  }

  @Patch('/:code')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create  ot policy successfully.',
  })
  @customDecorators()
  async update(
    @AuthUser() user: AuthUserDto,
    @Param('code') code: string,
    @Body(ValidationPipe) updateOtPolicyDto: UpdateOtPolicyDto,
  ) {
    await this.otPolicyService.updateOtPolicy(user, code, updateOtPolicyDto);
    return { data: code };
  }
}
