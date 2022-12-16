import { BadRequestException, Injectable } from '@nestjs/common';
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
    const path = `./uploads/${userId}`;

    this.createDirectory(path);
    await qrcode.toFile(`${path}/qrcode.png`, otpauth);
    this.usersService.setSecret(userId, secret);
    return { url: `http://localhost:4444/images/${userId}/qrcode.png` };
  }

  async enable(userId: string, code: string) {
    const isCodeInvalid = !(await this.verify(userId, code));
    if (isCodeInvalid) {
      throw new BadRequestException('Invalid Code');
    }
    this.usersService.enableTwoFactorAuth(userId);
  }

  async disable(userId: string, code: string) {
    const isCodeInvalid = !(await this.verify(userId, code));
    if (isCodeInvalid) {
      throw new BadRequestException('Invalid Code');
    }
    this.usersService.disableTwoFactorAuth(userId);
  }

  async verify(userId: string, code: string) {
    const secret = await this.usersService.getSecret(userId);
    return authenticator.verify({
      token: code,
      secret: secret,
    });
  }

  private createDirectory(path: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    fs.mkdirSync(path, { recursive: true });
  }
}
