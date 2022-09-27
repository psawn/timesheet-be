import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    AuthService,
    JwtStrategy,
    ConfigService,
    LeaveBenefitRepository,
  ],
  exports: [],
})
export class AuthModule {}
