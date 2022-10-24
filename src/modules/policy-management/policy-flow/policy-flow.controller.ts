import { Body, Controller, Param, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreatePolicyFlow } from './dto';
import { PolicyFlowService } from './policy-flow.service';

@Auth()
@ApiTags('PolicyFlow')
@Controller('policy-flows')
export class PolicyFlowController {
  constructor(private readonly policyFlowService: PolicyFlowService) {}

  @Post('/:policyCode')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create policy flow successfully.',
  })
  @customDecorators()
  async create(
    @Param('policyCode') policyCode: string,
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createPolicyFlow: CreatePolicyFlow,
  ) {
    const policyFlow = await this.policyFlowService.create(
      policyCode,
      user,
      createPolicyFlow,
    );
    return { data: policyFlow };
  }
}
