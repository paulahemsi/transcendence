import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

interface User {

}

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  deserializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, null);
  }
}