import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelTypeService } from 'src/channels/channel-type.service';
import { ChannelsService } from 'src/channels/channels.service';
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
