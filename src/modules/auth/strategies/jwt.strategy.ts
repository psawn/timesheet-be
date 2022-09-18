import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from 'src/shared/services/config.service';
import { UserService } from 'src/modules/user-management/user/user.service';
import { omit } from 'lodash';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.accessJWTSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneWithRoles({
      id: payload.id,
      email: payload.email,
    });

    return omit(user, ['password', 'roleMapping']);
  }
}
