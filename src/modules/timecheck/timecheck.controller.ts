import {
  Body,
  Controller,
  Get,
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
import { CheckInDto, FilterTimecheckDto } from './dto';
import { Test } from './dto/abc.dto';
import { TimecheckService } from './timecheck.service';

@Auth()
@ApiTags('Timecheck')
@Controller('timecheks')
export class TimecheckController {
  constructor(private readonly timecheckSerive: TimecheckService) {}

  @Get()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get all timechecks successfully.',
  })
  @customDecorators()
  async getAll(@Query(ValidationPipe) filterTimecheckDto: FilterTimecheckDto) {
    const { items, pagination } = await this.timecheckSerive.getAll(
      filterTimecheckDto,
    );
    return { data: items, pagination: pagination };
  }

  @Get('/my-timecheck')
  @ApiResponse({
    status: 200,
    description: 'Get my timechecks successfully.',
  })
  @customDecorators()
  async getMyTimecheck(
    @AuthUser() user: AuthUserDto,
    @Query(ValidationPipe) filterTimecheckDto: FilterTimecheckDto,
  ) {
    const { items, pagination } = await this.timecheckSerive.getMyTimecheck(
      user,
      filterTimecheckDto,
    );
    return { data: items, pagination: pagination };
  }

  @Post('/check-in')
  @ApiResponse({
    status: 200,
    description: 'Check in successfully.',
  })
  @customDecorators()
  async checkIn(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) checkInDto: CheckInDto,
  ) {
    const timecheck = await this.timecheckSerive.checkIn(user, checkInDto);
    return { data: timecheck };
  }

  @Post('/get-total')
  @ApiResponse({
    status: 200,
    description: 'Get my timechecks successfully.',
  })
  @customDecorators()
  async abc(@Body() test: Test) {
    const result = await this.timecheckSerive.getTotalWorkingDays(test);
    return { data: result };
  }
}
