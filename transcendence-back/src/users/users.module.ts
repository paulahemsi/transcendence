import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember, Friendship, User } from 'src/entity';
import { MatchHistory } from 'src/entity';
import { FriendshipService } from '../friendship/friendship.service';
import { MatchHistoryService } from 'src/match-history/match-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, MatchHistory, Friendship, ChannelMember])],
  controllers: [UsersController],
  providers: [UsersService, FriendshipService, MatchHistoryService, ChannelMember],
  exports: [UsersService],
})
export class UsersModule {}
