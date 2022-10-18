import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import {
  CreateTimelogDto,
  DeleteTimelogDto,
  FilterTimelogsDto,
  FilterMyTimelogsDto,
} from './dto';
import { TimelogService } from './timelog.service';

@Auth()
@ApiTags('Timelog')
@Controller('timelogs')
export class TimelogController {
  constructor(private readonly timelogService: TimelogService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all timelogs successfully.',
  })
  @customDecorators()
  async getAll(@Query() filterTimelogsDto: FilterTimelogsDto) {
    const data = await this.timelogService.getAll(filterTimelogsDto);
    return { data };
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create timelog successfully.',
  })
  @customDecorators()
  async create(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createTimelogDto: CreateTimelogDto,
  ) {
    const timelog = await this.timelogService.create(user, createTimelogDto);
    return { data: timelog };
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Delete timelog successfully.',
  })
  @customDecorators()
  async delete(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) deleteTimelogDto: DeleteTimelogDto,
  ) {
    await this.timelogService.delete(user, deleteTimelogDto);
    return { data: null };
  }

  @Get('/my-timelogs')
  @ApiResponse({
    status: 200,
    description: 'Get my timelogs successfully.',
  })
  @customDecorators()
  async getDetaliMyTimelogs(
    @AuthUser() user: AuthUserDto,
    @Query() filterMyTimelogsDto: FilterMyTimelogsDto,
  ) {
    const data = await this.timelogService.getDetaliMyTimelogs(
      user,
      filterMyTimelogsDto,
    );
    return { data };
  }
}
