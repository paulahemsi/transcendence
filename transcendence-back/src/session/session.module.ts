import { Module } from '@nestjs/common';
import { SessionGateway } from './session.gateway';

@Module({
  providers: [SessionGateway],
})
export class SessionModule {}
