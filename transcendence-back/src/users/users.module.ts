import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blocked, ChannelMember, Friendship, Message, User } from 'src/entity';
import { MatchHistory } from 'src/entity';
import { FriendshipService } from '../friendship/friendship.service';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { ChannelsModule } from 'src/channels/channels.module';
import { BlockedService } from 'src/friendship/blocked.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      MatchHistory,
      Friendship,
      Blocked,
      Message,
      ChannelMember,
    ]),
    ChannelsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    FriendshipService,
    MatchHistoryService,
    BlockedService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
