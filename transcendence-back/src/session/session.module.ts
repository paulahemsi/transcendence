import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ConnectedUsersModule } from 'src/connected-users/connected-users.module';
import { UsersModule } from 'src/users/users.module';
import { SessionGateway } from './session.gateway';

@Module({
  imports: [AuthModule, ConnectedUsersModule, UsersModule],
  providers: [SessionGateway],
})
export class SessionModule {}
