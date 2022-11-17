import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blocked, ChannelMember, Friendship, Message, User } from 'src/entity';
import { FriendshipService } from '../friendship/friendship.service';
import { ChannelsModule } from 'src/channels/channels.module';
import { BlockedService } from 'src/friendship/blocked.service';
import { MatchHistoryModule } from 'src/match-history/match-history.module';

@Module({
  imports: [
    MatchHistoryModule,
    ChannelsModule,
    TypeOrmModule.forFeature([
      User,
      Friendship,
      Message,
      ChannelMember,
      Blocked,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, FriendshipService, BlockedService],
  exports: [UsersService],
})
export class UsersModule {}
