import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Intra42Strategy } from './strategies/intra42.strategy';

@Module({
  providers: [Intra42Strategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
