import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { TwoFactorAuthCodeDto } from 'src/dto/two-factor-auth-code.dto';
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
  async enable(@Req() request: Request, @Body() body: TwoFactorAuthCodeDto) {
    const userId = request.user;
    return this.twoFactorAuthService.enable(`${userId}`, body.code);
  }

  @Post('disable')
  async disable(@Req() request: Request, @Body() body: TwoFactorAuthCodeDto) {
    const userId = request.user;
    return this.twoFactorAuthService.disable(`${userId}`, body.code);
  }
}
