import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Intra42AuthGuard } from './guards/intra42.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

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
  async intraRedirect(@Res() response: Response, @Req() request: Request) {
    this.authService.login(response, request.user);
    response.redirect('http://localhost:3000');
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  getUserStatus(@Res() response: Response) {
    response.sendStatus(200);
    console.log('\nCongratulations, your JWT guard works.\n');
  }

  @Get('logout')
  logoutUser(@Res() response: Response) {
    console.log('Hello');
    response.clearCookie('accessToken');
    response.redirect('http://localhost:3000');
  }
}
