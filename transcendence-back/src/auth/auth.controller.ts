import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Intra42AuthGuard } from './guards/intra42.guard';

@Controller('auth')
export class AuthController {
  @Get('login')
  @UseGuards(Intra42AuthGuard)
  intraLogin() {
    return;
  }

  @Get('redirect')
  intraRedirect(@Res() response: Response) {
    response.send(200);
  }

  @Get('status')
  getUserStatus(@Res() response: Response) {
    response.send(501);
  }

  @Get('logout')
  logoutUser(@Res() response: Response) {
    response.send(501);
  }
}
