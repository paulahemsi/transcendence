import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  constructor(private twoFactorAuthService: TwoFactorAuthService) {}

  @Get('generate')
  async generate(@Req() request: Request) {
    const userId = request.user;
    return this.twoFactorAuthService.generateQrCode(`${userId}`);
  }

  @Post('enable')
  async enable(@Req() request: Request) {
    const userId = request.user;
    return this.twoFactorAuthService.enable(`${userId}`);
  }
}
