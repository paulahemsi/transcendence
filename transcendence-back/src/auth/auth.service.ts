import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  validateUser(user: any) {
    this.usersService
      .findUsersByExternalId(user.external_id)
      .then((existingUser) => {
        if (Object.keys(existingUser).length == 0) {
          this.usersService.createUser(user);
        }
      });
  }

  async login(response: any, user: any): Promise<any> {
    const payload = {
      username: user.username,
      external_id: user.external_id,
      email: user.email,
    };
    this.validateUser(user);
    response.cookie('accessToken', this.jwtService.sign(payload));
  }
}
