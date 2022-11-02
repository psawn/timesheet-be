import { Body, Controller, Param, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreateOtPolicyFlow } from './dto';
import { OtPolicyFlowService } from './ot-policy-flow.service';

@Auth()
@ApiTags('OtPolicyFlow')
@Controller('ot-policy-flows')
export class OtPolicyFlowController {
  constructor(private readonly otPolicyFlowService: OtPolicyFlowService) {}

  @Post('/:otPolicyCode')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create ot policy flow successfully.',
  })
  @customDecorators()
  async create(
    @Param('otPolicyCode') otPolicyCode: string,
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createOtPolicyFlow: CreateOtPolicyFlow,
  ) {
    const otPolicyFlow = await this.otPolicyFlowService.create(
      otPolicyCode,
      user,
      createOtPolicyFlow,
    );
    return { data: otPolicyFlow };
  }
}
