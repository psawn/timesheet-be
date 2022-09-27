import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { CreateRequestDto } from './dto';
import { RequestService } from './request.service';

@Auth()
@ApiTags('Request')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create request successfully.',
  })
  @customDecorators()
  async createRequest(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createRequestDto: CreateRequestDto,
  ) {
    const request = await this.requestService.createRequest(
      user,
      createRequestDto,
    );
    return { data: request };
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get requests successfully.',
  })
  @customDecorators()
  async getAll(@AuthUser() user: AuthUserDto) {}
}
