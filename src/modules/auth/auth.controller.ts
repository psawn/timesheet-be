import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { customDecorators } from 'src/common/custom-decorators/response.decorator';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from './auth.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { EmitterService } from 'src/event-emitter/event-emitter.service';

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

  @Get('google/login')
  googleLogin() {
    return { msg: 'Google Auth' };
  }

  @Get('google/redirect')
  googleRedirect() {
    return { msg: 'Ok' };
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
}
