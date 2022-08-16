import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationInterface } from '../auth.service';
import { Strategy } from 'passport-42';

// This UserProfile type is temporary and for test purposes only.

type UserProfile = {
  id: string;
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
      clientID:
        '27c3a814c14f4a5923a143c3dea7afb3c7e309a4f38dee462e80d5bbb282b69b',
      clientSecret:
        'f988d1a3ff8ae9a5fee4a332a480e5d3513768b6c254838a8eb2e5c9bd714712',
      callbackURL: 'http://localhost:4444/auth/redirect',
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
