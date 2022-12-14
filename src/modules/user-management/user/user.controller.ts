import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { CreateUserDto, FilterUsersDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { RoleCodeEnum } from 'src/common/constants/role.enum';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { AuthUser } from 'src/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Auth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.DER_MANAGER, RoleCodeEnum.DIR_MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Get users successfully.',
  })
  @customDecorators()
  async getAll(@Query(ValidationPipe) filterUsersDto: FilterUsersDto) {
    const { items, pagination } = await this.userService.getAll(filterUsersDto);
    return { data: items, pagination };
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
    return { data };
  }

  @Get('/me')
  @ApiResponse({
    status: 200,
    description: 'Get user information successfully.',
  })
  @customDecorators()
  async getOwnersInfo(@AuthUser() user: AuthUserDto) {
    const data = await this.userService.getOwnersInfo(user.code);
    return { data };
  }

  @Get('/roles')
  @ApiResponse({
    status: 200,
    description: 'Get user roles successfully.',
  })
  @customDecorators()
  async getRoles(@AuthUser() user: AuthUserDto) {
    const data = await this.userService.getRoles(user.code);
    return { data };
  }

  @Post()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Create user successfully.',
  })
  @customDecorators()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);
    return { data };
  }

  @Post('/upload-avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 200,
    description: 'Upload user avatar successfully.',
  })
  @customDecorators()
  async uploadAvatar(
    @AuthUser() user: AuthUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.userService.uploadAvatar(user, file);
    return { data };
  }
}
