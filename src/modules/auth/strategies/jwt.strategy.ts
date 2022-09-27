import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from 'src/shared/services/config.service';
import { omit } from 'lodash';
import { UserRepository } from 'src/modules/user-management/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.accessJWTSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOneWithRoles({
      id: payload.id,
      email: payload.email,
    });

    return omit(user, ['password', 'roleMapping']);
  }
}
