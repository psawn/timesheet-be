import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { FilterUsersDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { RoleCodeEnum } from 'src/common/constants/role.enum';

@Auth()
@ApiTags('User')
@Controller('users')
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
    const result = await this.userService.findByConditions(filterUsersDto);
    return { data: result.items, pagination: result.meta };
  }

  @Patch()
  @ApiResponse({
    status: 200,
    description: 'Update user successfully.',
  })
  @customDecorators()
  async update(
    @Req() request: any,
    @Body(new ValidationPipe({ whitelist: true })) updateUserDto: UpdateUserDto,
  ) {
    const data = await this.userService.update(request, updateUserDto);
    return {
      message: 'Update user successfully.',
      data: data,
    };
  }
}
