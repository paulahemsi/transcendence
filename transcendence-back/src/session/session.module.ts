import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ConnectedUsersModule } from 'src/connected-users/connected-users.module';
import { SessionGateway } from './session.gateway';

@Module({
  imports: [AuthModule, ConnectedUsersModule],
  providers: [SessionGateway],
})
export class SessionModule {}
