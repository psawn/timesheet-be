import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser = async (user: any, done: any) => {
    done(null, user);
  };

  deserializeUser = async (user: any, done: any) => {
    done(null, user);
  };
}
