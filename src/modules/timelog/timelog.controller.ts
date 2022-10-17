import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { Roles } from 'src/decorators/role.decorator';
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
  async getAll() {
    return {
      data: 'avas',
    };
  }
}
