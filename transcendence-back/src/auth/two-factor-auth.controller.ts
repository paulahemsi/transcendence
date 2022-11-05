import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { authenticator } from 'otplib';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  @Get('generate')
  async generate(@Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const qrcode = require('qrcode');
    const userId = request.user;
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri('tccendence', 'user', secret);

    await qrcode.toFile(`./uploads/${userId}/qrcode.png`, otpauth);

    return { url: `http://localhost:4444/images/${userId}/qrcode.png` };
  }
}
