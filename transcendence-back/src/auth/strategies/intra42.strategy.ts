import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationInterface } from '../auth.service';
import { Strategy } from 'passport-42';

// This UserProfile type is temporary and for test purposes only.

export type UserProfile = {
  id: number;
  username: string;
  emails: string[];
  photos: string[];
};

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, '42') {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationInterface,
  ) {
    super({
      clientID: process.env.INTRA42_CLIENT_ID,
      clientSecret: process.env.INTRA42_CLIENT_SECRET,
      callbackURL: process.env.INTRA42_CALLBACK_URL,
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: UserProfile,
  ): Promise<void> {
    const { id, username, emails, photos } = profile;
    // TODO: figure out the best way to extract info from key/value pairs inside a vector.
    console.log(id, username, emails, photos);
  }
}