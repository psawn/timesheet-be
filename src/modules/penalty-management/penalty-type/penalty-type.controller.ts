import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import {
  CreatePenaltyTypeDto,
  FilterPenaltyTypeDto,
  UpdatePenaltyTypeDto,
} from './dto';
import { PenaltyTypeService } from './penalty-type.service';

@Auth()
@ApiTags('PenaltyType')
@Controller('penalty-types')
export class PenaltyTypeController {
  constructor(private readonly penaltyTypeService: PenaltyTypeService) {}

  @Get()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get all penalty types successfully.',
  })
  @customDecorators()
  async getAll(@Query() filterPenaltyTypeDto: FilterPenaltyTypeDto) {
    const { items, pagination } = await this.penaltyTypeService.getAll(
      filterPenaltyTypeDto,
    );
    return { data: items, pagination };
  }

  @Post()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create penalty type successfully.',
  })
  @customDecorators()
  async createPenaltyType(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createPenaltyTypeDto: CreatePenaltyTypeDto,
  ) {
    const penaltyType = await this.penaltyTypeService.createPenaltyType(
      user,
      createPenaltyTypeDto,
    );
    return { data: penaltyType.code };
  }

  @Patch('/:code')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Update penalty type successfully.',
  })
  @customDecorators()
  async updatePenaltyType(
    @AuthUser() user: AuthUserDto,
    @Param('code') code: string,
    @Body(ValidationPipe) updatePenaltyTypeDto: UpdatePenaltyTypeDto,
  ) {
    const penaltyType = await this.penaltyTypeService.updatePenaltyType(
      user,
      code,
      updatePenaltyTypeDto,
    );
    return { data: penaltyType };
  }
}
