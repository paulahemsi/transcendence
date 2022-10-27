import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUser } from 'src/entity';
import { ConnnectedUsersService } from './connected-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedUser])],
  providers: [ConnnectedUsersService],
  exports: [ConnnectedUsersService],
})
export class ConnectedUsersModule {}
