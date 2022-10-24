import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreateOtRequestDto } from './dto/create-ot-request.dto';
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
}
