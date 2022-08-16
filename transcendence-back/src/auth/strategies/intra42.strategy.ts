import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Profile } from 'passport';
import { Strategy } from 'passport-42';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID:
        '27c3a814c14f4a5923a143c3dea7afb3c7e309a4f38dee462e80d5bbb282b69b',
      clientSecret:
        'f988d1a3ff8ae9a5fee4a332a480e5d3513768b6c254838a8eb2e5c9bd714712',
      callbackURL: 'http://localhost:4444/auth/redirect',
      scope: ['public'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken, refreshToken, profile);
  }
}
