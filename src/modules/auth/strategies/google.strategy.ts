import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/shared/services/config.service';
import { UserService } from 'src/modules/user-management/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.google.clientID,
      clientSecret: configService.google.clientSecret,
      callbackURL: configService.google.callbackURL,
      // passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.userService.socialLogin(
      { email: profile.emails[0].value },
      {
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        name: `${profile.name.familyName} ${profile.name.givenName}`,
        provider: profile.provider,
      },
    );

    // if no return the app will throw Unauthorized
    return user;
  }
}
