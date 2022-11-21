import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ConnectedUsersModule } from 'src/connected-users/connected-users.module';
import { MatchHistoryModule } from 'src/match-history/match-history.module';
import { UsersModule } from 'src/users/users.module';
import { SessionGateway } from './session.gateway';

@Module({
  imports: [AuthModule, ConnectedUsersModule, UsersModule, MatchHistoryModule],
  providers: [SessionGateway],
  exports: [SessionGateway],
})
export class SessionModule {}
