import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GameGateway } from './game.gateway';

@Module({
  imports: [AuthModule],
  providers: [GameGateway],
})
export class GameModule {}
