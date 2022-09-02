import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship, User } from 'src/entity';
import { MatchHistory } from 'src/entity';
import { FriendshipService } from '../friendship/friendship.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, MatchHistory, Friendship])],
  controllers: [UsersController],
  providers: [UsersService, FriendshipService],
  exports: [UsersService],
})
export class UsersModule {}
