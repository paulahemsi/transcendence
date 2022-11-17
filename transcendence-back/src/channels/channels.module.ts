import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Channel,
  ChannelAdmin,
  ChannelMember,
  ChannelType,
  Message,
} from 'src/entity';
import { UsersModule } from 'src/users/users.module';
import { ChannelTypeService } from './channel-type.service';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([
      Channel,
      ChannelMember,
      ChannelAdmin,
      Message,
      ChannelType,
    ]),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelTypeService],
  exports: [ChannelsService, ChannelTypeService],
})
export class ChannelsModule {}
