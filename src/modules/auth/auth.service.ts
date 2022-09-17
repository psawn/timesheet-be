import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/shared/services/config.service';
import { UsersRepository } from '../user-management/users/user.repository';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    return await this.usersRepository.signUp(signUpDto);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersRepository.findOneByConditions({
      where: {
        email: email,
      },
    });

    if (user && user.validatePassword(password)) {
      const payload = {
        id: user.id,
        email: user.email,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.jwt.accessJWTSecret,
        expiresIn: this.configService.jwt.accessJWTExpire,
      });
      const refreshToken = await this.jwtService.signAsync(
        { id: user.id },
        {
          secret: this.configService.jwt.accessJWTSecret,
          expiresIn: this.configService.jwt.accessJWTExpire,
        },
      );

      return { accessToken, refreshToken };
    }

    throw new BadRequestException('Invalid credentials');
  }
}
