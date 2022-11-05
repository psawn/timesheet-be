import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from './auth.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { EmitterService } from 'src/event-emitter/event-emitter.service';
import { GoogleAuthGuard } from 'src/guards/google.guard';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rabbitmqService: RabbitmqService,
    private readonly emitterService: EmitterService,
  ) {}

  @Post('/signup')
  @ApiResponse({
    status: 201,
    description: 'Create user successfully.',
  })
  @customDecorators()
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return {
      message: 'Create user successfully.',
    };
  }

  @Post('/signin')
  @ApiResponse({
    status: 200,
    description: 'Login successfully.',
  })
  @customDecorators()
  async signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    const data = await this.authService.signIn(signInDto);
    return {
      message: 'Login successfully.',
      data,
    };
  }

  @Get('/reabbimq-test')
  async test() {
    await this.rabbitmqService.getHello();
    await this.rabbitmqService.getHelloAsync();
    await this.rabbitmqService.publishEvent();
  }

  @Post('/reabbimq-test')
  async createPost() {
    return await this.rabbitmqService.test();
  }

  @Get('/event-emitter')
  async testEventEmitter() {
    this.emitterService.emitEvent();
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  async googleAuth() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async handleGoogleRedirec() {
    return { msg: 'OK' };
  }

  @Get('status')
  async signInWithSocialCredentials(@Req() request: Request) {
    if (request.user && request.user['email']) {
      const data = await this.authService.signInWithSocialCredentials(
        request.user['email'],
      );
      return {
        message: 'Login successfully.',
        data,
      };
    }

    return { msg: 'Not Authenticated' };
  }
}
