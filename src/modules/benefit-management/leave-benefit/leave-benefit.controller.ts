import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreateLeaveBenefitDto } from './dto';
import { LeaveBenefitService } from './leave-benefit.service';

@Auth()
@ApiTags('LeaveBenefit')
@Controller('leave-benefits')
export class LeaveBenefitController {
  constructor(private readonly leaveBenefitService: LeaveBenefitService) {}

  @Post()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create benefit successfully.',
  })
  @customDecorators()
  async createBenefit(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createLeaveBenefitDto: CreateLeaveBenefitDto,
  ) {
    const leaveBenefit = await this.leaveBenefitService.createBenefit(
      user,
      createLeaveBenefitDto,
    );
    return { data: leaveBenefit.code };
  }

  @Get()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create benefit successfully.',
  })
  @customDecorators()
  async getAll() {
    const data = await this.leaveBenefitService.getAll();
    return { data };
  }
}
