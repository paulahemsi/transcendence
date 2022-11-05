import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { authenticator } from 'otplib';

@Injectable()
export class TwoFactorAuthService {
  constructor(private usersService: UsersService) {}

  async generateQrCode(userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const qrcode = require('qrcode');
    const user = await this.usersService.findUser(userId);
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.username, 'tccendence', secret);

    await qrcode.toFile(`./uploads/${userId}/qrcode.png`, otpauth);
    this.usersService.setSecret(userId, secret);
    return { url: `http://localhost:4444/images/${userId}/qrcode.png` };
  }

  async enable(userId: string) {
    this.usersService.enableTwoFactorAuth(userId);
  }
}
