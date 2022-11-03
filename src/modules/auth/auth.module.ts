import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmitterModule } from 'src/event-emitter/event-emitter.module';
import { EmitterService } from 'src/event-emitter/event-emitter.service';
import { RabitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { ConfigService } from 'src/shared/services/config.service';
import { LeaveBenefitRepository } from '../benefit-management/leave-benefit/leave-benefit.repository';
import { User } from '../user-management/user/user.entity';
import { UserRepository } from '../user-management/user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

const configService = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: configService.jwt.accessJWTSecret,
      signOptions: {
        expiresIn: configService.jwt.accessJWTExpire,
      },
    }),
    RabitmqModule,
    EmitterModule,
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    AuthService,
    JwtStrategy,
    ConfigService,
    LeaveBenefitRepository,
    // the emit function is called twice when add EmitterService to provider, add EmitterModule to imports is not
    // EmitterService,
  ],
  exports: [],
})
export class AuthModule {}
