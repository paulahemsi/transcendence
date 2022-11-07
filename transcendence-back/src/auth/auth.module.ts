import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Intra42Strategy } from './strategies/intra42.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  providers: [AuthService, TwoFactorAuthService, Intra42Strategy, JwtStrategy],
  controllers: [AuthController, TwoFactorAuthController],
  exports: [AuthService],
})
export class AuthModule {}
