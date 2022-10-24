import { Body, Controller, Param, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreateOtRequestFlow } from './dto';
import { OtRequestFlowService } from './ot-request-flow.service';

@Auth()
@ApiTags('OtRequestFlow')
@Controller('ot-request-flows')
export class OtRequestFlowController {
  constructor(private readonly otRequestFlowService: OtRequestFlowService) {}

  @Post('/:otPolicyCode')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create ot request flow successfully.',
  })
  @customDecorators()
  async create(
    @Param('otPolicyCode') otPolicyCode: string,
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createOtRequestFlow: CreateOtRequestFlow,
  ) {
    const otRequestFlow = await this.otRequestFlowService.create(
      otPolicyCode,
      user,
      createOtRequestFlow,
    );
    return { data: otRequestFlow };
  }
}
