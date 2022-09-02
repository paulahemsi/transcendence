import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity';
import { MatchHistory } from 'src/entity';
import { MatchHistoryService } from 'src/match-history/match-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, MatchHistory])],
  controllers: [UsersController],
  providers: [UsersService, MatchHistoryService],
  exports: [UsersService],
})
export class UsersModule {}
