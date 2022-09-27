import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { FilterUsersDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { AuthUser } from 'src/decorators/user.decorator';

@Auth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get users successfully.',
  })
  @customDecorators()
  async getAll(@Query(ValidationPipe) filterUsersDto: FilterUsersDto) {
    const result = await this.userService.getAll(filterUsersDto);
    return { data: result.items, pagination: result.meta };
  }

  @Patch('/:code')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Update user successfully.',
  })
  @customDecorators()
  async update(
    @AuthUser() user: AuthUserDto,
    @Param('code') code: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    const data = await this.userService.update(user, code, updateUserDto);
    return { data: data };
  }
}
