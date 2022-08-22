import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

export type UserProfile = {
  id: number;
  username: string;
  emails: [{ [key: string]: string }];
  photos: [{ [key: string]: string }];
};

export type Intra42UserData = {
  external_id: number;
  username: string;
  email: string;
  image_url: string;
};

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, '42') {
  constructor() {
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
  ): Promise<Intra42UserData> {
    const { id, username, emails, photos } = profile;
    const user: Intra42UserData = {
      external_id: id,
      username: username,
      email: emails[0].value,
      image_url: photos[0].value,
    };
    if (!user) {
      throw new HttpException('Intra 42 user not found.', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
