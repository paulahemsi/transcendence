import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TwoFactorAuthCodeDto } from 'src/dto/two-factor-auth-code.dto';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  constructor(
    private twoFactorAuthService: TwoFactorAuthService,
    private jwtService: JwtService,
  ) {}

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

  @Post('login')
  async login(
    @Query('user', ParseUUIDPipe) userId: string,
    @Body() body: TwoFactorAuthCodeDto,
    @Res() response: Response,
  ) {
    if (!this.twoFactorAuthService.verify(`${userId}`, body.code)) {
      throw new BadRequestException('Invalid Code');
    }
    const payload = { id: userId };
    response.cookie('accessToken', this.jwtService.sign(payload), {
      sameSite: 'lax',
    });
    return response.status(200).json({
      cookie: response.getHeader('set-cookie'),
    });
  }
}
