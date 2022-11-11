import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
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
  ChangeOtRequestStatus,
  CreateOtRequestDto,
  FilterOtRequestsDto,
  UpdateOtRequestDto,
} from './dto';
import { OtRequestService } from './ot-request.service';

@Auth()
@ApiTags('OtRequest')
@Controller('ot-requests')
export class OtRequestController {
  constructor(private readonly otRequestService: OtRequestService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Get all ot policies successfully.',
  })
  @customDecorators()
  async create(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createOtRequestDto: CreateOtRequestDto,
  ) {
    const otRequest = await this.otRequestService.create(
      user,
      createOtRequestDto,
    );
    return { data: otRequest };
  }

  @Put('/change-status')
  @ApiResponse({
    status: 200,
    description: 'Change status requests successfully.',
  })
  @customDecorators()
  async changeStatus(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) changeOtRequestStatus: ChangeOtRequestStatus,
  ) {
    const otRequest = await this.otRequestService.changeStatus(
      user,
      changeOtRequestStatus,
    );
    return { date: otRequest };
  }

  @Patch('/:id')
  @ApiResponse({
    status: 200,
    description: 'Update request successfully.',
  })
  @customDecorators()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) updateOtRequestDto: UpdateOtRequestDto,
  ) {
    const otRequest = await this.otRequestService.update(
      id,
      user,
      updateOtRequestDto,
    );
    return { data: otRequest };
  }

  @Get()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get requests successfully.',
  })
  @customDecorators()
  async getAll(@Query() filterOtRequestsDto: FilterOtRequestsDto) {
    const { items, pagination } = await this.otRequestService.getAll(
      filterOtRequestsDto,
    );
    return { data: items, pagination };
  }

  @Get('/my-request')
  @ApiResponse({
    status: 200,
    description: 'Get my requests successfully.',
  })
  @customDecorators()
  async getAllMyRequests(
    @AuthUser() user: AuthUserDto,
    @Query() filterOtRequestsDto: FilterOtRequestsDto,
  ) {
    const { items, pagination } = await this.otRequestService.getAllMyRequests(
      user,
      filterOtRequestsDto,
    );
    return { data: items, pagination };
  }

  @Get('/my-request/:id')
  @ApiResponse({
    status: 200,
    description: 'Get request successfully.',
  })
  @customDecorators()
  async getMyRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthUser() user: AuthUserDto,
  ) {
    const otRequest = await this.otRequestService.getMyRequest(id, user);
    return { data: otRequest };
  }

  @Get('/approver')
  @ApiResponse({
    status: 200,
    description: 'Get request to approver successfully.',
  })
  @customDecorators()
  async getAllForApprover(
    @AuthUser() user: AuthUserDto,
    @Query() filterOtRequestsDto: FilterOtRequestsDto,
  ) {
    const { items, pagination } = await this.otRequestService.getAllForApprover(
      user,
      filterOtRequestsDto,
    );
    return { data: items, pagination };
  }

  @Get('/:id')
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get request successfully.',
  })
  @customDecorators()
  async getRequest(@Param('id', ParseUUIDPipe) id: string) {
    const otRequest = await this.otRequestService.getRequest(id);
    return { data: otRequest };
  }
}
