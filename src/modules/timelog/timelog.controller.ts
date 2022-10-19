import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import {
  CreateTimelogDto,
  DeleteTimelogDto,
  FilterTimelogsDto,
  FilterDetailTimelogsDto,
} from './dto';
import { TimelogService } from './timelog.service';

@Auth()
@ApiTags('Timelog')
@Controller('timelogs')
export class TimelogController {
  constructor(private readonly timelogService: TimelogService) {}

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all timelogs successfully.',
  })
  @customDecorators()
  async getAll(
    @AuthUser() user: AuthUserDto,
    @Query() filterTimelogsDto: FilterTimelogsDto,
  ) {
    const data = await this.timelogService.getAll(user, filterTimelogsDto);
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
  async getMyTimelogs(
    @AuthUser() user: AuthUserDto,
    @Query() filterDetailTimelogsDto: FilterDetailTimelogsDto,
  ) {
    const data = await this.timelogService.getMyTimelogs(
      user.code,
      filterDetailTimelogsDto,
    );
    return { data };
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @Get('/:userCode')
  @ApiResponse({
    status: 200,
    description: 'Get user timelogs successfully.',
  })
  @customDecorators()
  async getUserTimelogs(
    @AuthUser() user: AuthUserDto,
    @Param('userCode') userCode: string,
    @Query() filterDetailTimelogsDto: FilterDetailTimelogsDto,
  ) {
    const data = await this.timelogService.getDetaliTimelogs(
      userCode,
      filterDetailTimelogsDto,
      user,
    );
    return { data };
  }
}
