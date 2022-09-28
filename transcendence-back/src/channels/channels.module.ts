import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel, ChannelMember } from 'src/entity';
import { UsersModule } from 'src/users/users.module';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelMember]), UsersModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
