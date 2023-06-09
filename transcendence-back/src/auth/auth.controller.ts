import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Intra42AuthGuard } from './guards/intra42.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(Intra42AuthGuard)
  intraLogin() {
    return;
  }

  @Get('redirect')
  @UseGuards(Intra42AuthGuard)
  intraRedirect(@Res() response: Response, @Req() request: Request) {
    this.authService.login(response, request.user);
  }

  @Get('status')
  getUserStatus(@Res() response: Response) {
    response.sendStatus(200);
  }

  @Get('logout')
  async logoutUser(@Res() response: Response) {
    await this.authService
      .logout(response)
      .then(() => response.redirect(process.env.FRONT_HOST));
  }
}
