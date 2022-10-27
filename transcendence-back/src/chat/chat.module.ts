import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelTypeService } from 'src/channels/channel-type.service';
import { ChannelsService } from 'src/channels/channels.service';
import { ConnectedUsersModule } from 'src/connected-users/connected-users.module';
import {
  Channel,
  ChannelAdmin,
  ChannelMember,
  ChannelType,
  Message,
} from 'src/entity';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConnectedUsersModule,
    TypeOrmModule.forFeature([
      Channel,
      ChannelMember,
      ChannelAdmin,
      Message,
      ChannelType,
    ]),
  ],
  providers: [ChatGateway, ChannelsService, ChannelTypeService],
})
export class ChatModule {}
