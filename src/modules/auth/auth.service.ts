import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/shared/services/config.service';
import { UserRepository } from '../user-management/user/user.repository';
import { User } from '../user-management/user/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    return await this.userRepository.signUp(signUpDto);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOneByConditions({
      where: { email: email },
    });

    if (user && (await user.validatePassword(password))) {
      return await this.generateJWT(user);
    }

    throw new BadRequestException('Invalid credentials');
  }

  async signInWithSocialCredentials(email: string) {
    const user = await this.userRepository.findOneByConditions({
      where: { email: email },
    });

    if (user) {
      return await this.generateJWT(user);
    }

    throw new BadRequestException('Invalid credentials');
  }

  async generateJWT(user: User) {
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
}
