import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel, ChannelAdmin, ChannelMember, ChannelType, Friendship, Message, User } from 'src/entity';
import { MatchHistory } from 'src/entity';
import { FriendshipService } from '../friendship/friendship.service';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { ChannelTypeService } from 'src/channels/channel-type.service';
import { ChannelsService } from 'src/channels/channels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      MatchHistory,
      Friendship,
      ChannelMember,
      ChannelType,
      Channel,
      ChannelAdmin,
      Message,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    FriendshipService,
    MatchHistoryService,
    ChannelTypeService,
    ChannelsService,
    ChannelMember,
  ],
  exports: [UsersService],
})
export class UsersModule {}
