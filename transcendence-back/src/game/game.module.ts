import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MatchHistoryModule } from 'src/match-history/match-history.module';
import { GameGateway } from './game.gateway';

@Module({
  imports: [AuthModule, MatchHistoryModule],
  providers: [GameGateway],
})
export class GameModule {}
