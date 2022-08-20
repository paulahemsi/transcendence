import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Intra42Strategy } from './strategies/intra42.strategy';

@Module({
  providers: [Intra42Strategy],
  controllers: [AuthController],
})
export class AuthModule {}
