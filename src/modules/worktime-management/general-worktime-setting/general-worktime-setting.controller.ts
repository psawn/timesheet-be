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
  CreateGenWorktimeStgDto,
  FilterGenWorktimeStgDto,
  UpdateGenWorktimeStgDto,
} from './dto';
import { GenWorktimeStgService } from './genaral-worktime-setting.service';

@Auth()
@ApiTags('GeneralWorktimeSetting')
@Controller('gen-worktime-stg')
export class GenWorktimeStgController {
  constructor(private readonly genWorktimeStgService: GenWorktimeStgService) {}

  @Post()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create worktime settings successfully.',
  })
  @customDecorators()
  async createWorktime(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createGenWorktimeStgDto: CreateGenWorktimeStgDto,
  ) {
    const worktimtStg = await this.genWorktimeStgService.createWorktime(
      user,
      createGenWorktimeStgDto,
    );
    return { data: worktimtStg.code };
  }

  @Patch('/:code')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create worktime settings successfully.',
  })
  @customDecorators()
  async updateWorktime(
    @AuthUser() user: AuthUserDto,
    @Param('code') code: string,
    @Body(ValidationPipe) updateGenWorktimeStgDto: UpdateGenWorktimeStgDto,
  ) {
    await this.genWorktimeStgService.updateWorktime(
      user,
      code,
      updateGenWorktimeStgDto,
    );
    return { data: null };
  }

  @Get()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get all worktime settings successfully.',
  })
  @customDecorators()
  async getAll(@Query() filterGenWorktimeStgDto: FilterGenWorktimeStgDto) {
    const result = await this.genWorktimeStgService.getAll(
      filterGenWorktimeStgDto,
    );
    return { data: result.items, pagination: result.meta };
  }

  @Get('/list-active')
  @ApiResponse({
    status: 200,
    description: 'Get all active worktime settings successfully.',
  })
  @customDecorators()
  async getAllActive(
    @Query() filterGenWorktimeStgDto: FilterGenWorktimeStgDto,
  ) {
    const result = await this.genWorktimeStgService.getAllActive(
      filterGenWorktimeStgDto,
    );
    return { data: result.items, pagination: result.meta };
  }
}
