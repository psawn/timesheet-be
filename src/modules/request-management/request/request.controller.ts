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
  ChangeRequestStatus,
  CreateRequestDto,
  FilterRequestsDto,
  UpdateRequestDto,
} from './dto';
import { RequestService } from './request.service';
import * as nodemailer from 'nodemailer';

@Auth()
@ApiTags('Request')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create request successfully.',
  })
  @customDecorators()
  async createRequest(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) createRequestDto: CreateRequestDto,
  ) {
    const request = await this.requestService.createRequest(
      user,
      createRequestDto,
    );
    return { data: request };
  }

  @Get()
  @Roles(RoleCodeEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Get requests successfully.',
  })
  @customDecorators()
  async getAll(@Query() filterRequestsDto: FilterRequestsDto) {
    const { items, pagination } = await this.requestService.getAll(
      filterRequestsDto,
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
    @Query() filterRequestsDto: FilterRequestsDto,
  ) {
    const { items, pagination } = await this.requestService.getAllMyRequests(
      user,
      filterRequestsDto,
    );
    return { data: items, pagination };
  }

  @Get('/approver')
  @ApiResponse({
    status: 200,
    description: 'Get request to approver successfully.',
  })
  @customDecorators()
  async getAllForApprover(
    @AuthUser() user: AuthUserDto,
    @Query() filterRequestsDto: FilterRequestsDto,
  ) {
    const { items, pagination } = await this.requestService.getAllForApprover(
      user,
      filterRequestsDto,
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
  async get(@Param('id', ParseUUIDPipe) id: string) {
    const request = await this.requestService.get(id);
    return { data: request };
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
    const request = await this.requestService.getMyRequest(id, user);
    return { data: request };
  }

  @Put('/change-status')
  @ApiResponse({
    status: 200,
    description: 'Change status requests successfully.',
  })
  @customDecorators()
  async changeStatus(
    @AuthUser() user: AuthUserDto,
    @Body(ValidationPipe) changeRequestStatus: ChangeRequestStatus,
  ) {
    const request = await this.requestService.changeStatus(
      user,
      changeRequestStatus,
    );
    return { date: request };
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
    @Body(ValidationPipe) updateRequestDto: UpdateRequestDto,
  ) {
    const request = await this.requestService.update(
      id,
      user,
      updateRequestDto,
    );
    return { data: request };
  }

  // @Get('/test/email')
  // async testEmail() {
  //   const transporter = nodemailer.createTransport({
  //     host: 'smtp.gmail.com',
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: 'huynvth2001006@fpt.edu.vn',
  //       pass: '100224081004mis',
  //     },
  //     tls: {
  //       rejectUnauthorized: false,
  //     },
  //   });

  //   await transporter.sendMail({
  //     from: '"Fred Foo 👻" <huynvth2001006@fpt.edu.vn>', // sender address
  //     to: 'bao.doan@savvycomsoftware.com', // list of receivers
  //     subject: 'Hello ✔', // Subject line
  //     text: 'Hello world?', // plain text body
  //     html: '<b>Hello world?</b>', // html body
  //   });
  // }
}
