import { Body, Controller, Post, Put, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { ChangeOtRequestStatus, CreateOtRequestDto } from './dto';
import { OtRequestService } from './ot-request.service';

@Auth()
@ApiTags('OtRequest')
@Controller('ot-requests')
export class OtRequestController {
  constructor(private readonly otRequestService: OtRequestService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Get all ot policies successfully.',
  })
  @customDecorators()
  async create(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createOtRequestDto: CreateOtRequestDto,
  ) {
    const otRequest = await this.otRequestService.create(
      user,
      createOtRequestDto,
    );
    return { data: otRequest };
  }

  @Put('/change-status')
  @ApiResponse({
    status: 200,
    description: 'Change status requests successfully.',
  })
  @customDecorators()
  async changeStatus(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) changeOtRequestStatus: ChangeOtRequestStatus,
  ) {
    const otRequest = await this.otRequestService.changeStatus(
      user,
      changeOtRequestStatus,
    );
    return { date: otRequest };
  }
}
