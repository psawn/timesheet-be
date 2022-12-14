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
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { FilterPenaltiesDto, ScanDto } from './dto';
import { PenaltyService } from './penalty.service';

@Auth()
@ApiTags('Penalty')
@Controller('penalties')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get penalties successfully.',
  })
  @customDecorators()
  async getAll(
    @AuthUser() user: AuthUserDto,
    @Query() filterPenaltiesDto: FilterPenaltiesDto,
  ) {
    return this.penaltyService.getAll(user, filterPenaltiesDto);
  }

  @Post('/scan')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Scan to generate penalties successfully.',
  })
  @customDecorators()
  async scan(@Body(ValidationPipe) scanDto: ScanDto) {
    return this.penaltyService.scan(scanDto);
  }
}
