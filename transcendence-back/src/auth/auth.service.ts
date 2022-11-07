import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(response: any, intra42User: any): Promise<any> {
    const user: User = await this.usersService.validate(intra42User);
    const payload = { id: user.id };
    response.cookie('accessToken', this.jwtService.sign(payload), {
      sameSite: 'Lax',
    });
  }

  async logout(response: any): Promise<any> {
    response.clearCookie('accessToken', { sameSite: 'Lax' });
  }

  validateJwt(jwt: string) {
    return this.jwtService.verify(jwt);
  }

  async validateUser(userId: string) {
    return this.usersService.findUserOrFail(userId);
  }
}
