import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from 'src/entity';
import { UsersModule } from 'src/users/users.module';
import { MatchHistoryService } from './match-history.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([MatchHistory]),
  ],
  providers: [MatchHistoryService],
  exports: [MatchHistoryService],
})
export class MatchHistoryModule {}
