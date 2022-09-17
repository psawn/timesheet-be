import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'src/shared/services/config.service';
import { User } from '../user-management/users/user.entity';
import { UsersRepository } from '../user-management/users/user.repository';
import { UsersService } from '../user-management/users/user.service';
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
    UsersRepository,
    AuthService,
    JwtStrategy,
    ConfigService,
    UsersService,
  ],
  exports: [],
})
export class AuthModule {}
