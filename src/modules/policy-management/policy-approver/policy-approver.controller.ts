import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AddApproverDto } from './dto';
import { PolicyApproverService } from './policy-approver.service';

@Auth()
@ApiTags('PolicyApprove')
@Controller('policy-approver')
export class PolicyApproverController {
  constructor(private readonly policyApproverService: PolicyApproverService) {}

  @Post('')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Add approver to policy successfully.',
  })
  @customDecorators()
  async addApprover(@Body(ValidationPipe) addApproverDto: AddApproverDto) {
    await this.policyApproverService.addApprover(addApproverDto);
    return { data: null };
  }
}
