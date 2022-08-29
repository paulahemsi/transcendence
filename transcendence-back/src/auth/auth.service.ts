import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  private createPayload(user: any) {
    return {
      username: user.username,
      external_id: user.external_id,
      email: user.email,
    };
  }

  async login(response: any, user: any): Promise<any> {
    const payload = this.createPayload(user);
    this.usersService.validate(user);
    response.cookie('accessToken', this.jwtService.sign(payload));
  }
}
