import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(response: any, user: any): Promise<any> {
    const payload = {
      username: user.username,
      external_id: user.external_id,
      email: user.email,
    };

    response.cookie('accessToken', this.jwtService.sign(payload));
  }
}
