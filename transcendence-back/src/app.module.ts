import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [AuthModule, PassportModule.register({ session: true })],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
