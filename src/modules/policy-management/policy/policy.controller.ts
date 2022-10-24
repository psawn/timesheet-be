import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { CreatePolicyDto, FilterPoliciesDto, UpdatePolicyDto } from './dto';
import { PolicyService } from './policy.service';

@Auth()
@ApiTags('Policy')
@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get policies successfully.',
  })
  @customDecorators()
  async getAll(@Query() filterPoliciesDto: FilterPoliciesDto) {
    const result = await this.policyService.getAll(filterPoliciesDto);
    return { data: result.items, pagination: result.meta };
  }

  @Get('/group')
  @ApiResponse({
    status: 200,
    description: 'Get policies by group successfully.',
  })
  @customDecorators()
  async getByGroup() {
    const data = await this.policyService.getByGroup();
    return { data };
  }

  @Get('/:code')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get policy successfully.',
  })
  @customDecorators()
  async get(@Param('code') code: string) {
    const result = await this.policyService.get(code);
    return { data: result };
  }

  @Post()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create policy successfully.',
  })
  @customDecorators()
  async createPolicy(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createPolicyDto: CreatePolicyDto,
  ) {
    const policy = await this.policyService.createPolicy(user, createPolicyDto);
    return { data: policy.code };
  }

  @Patch('/:code')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Update policy successfully.',
  })
  @customDecorators()
  async updatePolicy(
    @AuthUser() user: AuthUserDto,
    @Param('code') code: string,
    @Body(ValidationPipe) updatePolicyDto: UpdatePolicyDto,
  ) {
    await this.policyService.updatePolicy(user, code, updatePolicyDto);
    return { data: code };
  }

  // @Get('/:code/approver')
  // @ApiResponse({
  //   status: 200,
  //   description: 'Get approver successfully.',
  // })
  // @customDecorators()
  // async getApprover(
  //   @AuthUser() user: AuthUserDto,
  //   @Param('code') code: string,
  // ) {
  //   const result = await this.policyService.getApprover(user, code);
  //   return { data: result };
  // }
}
