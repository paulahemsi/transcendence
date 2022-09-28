import { Body, Controller, Delete, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { UpdateChannelDto } from 'src/dto/channel.dtos';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelService: ChannelsService) {}
  
  @Patch(':id')
  @HttpCode(204)
  updateUser(
    @Param('id') id: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelService.update(id, updateChannelDto);
  }

  @Post(':id/members')
  @HttpCode(204)
  addFriend(
    @Param('id') channelId: number,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
   return this.channelService.addMember(channelId, userId);
  }

  @Delete(':id/members')
  deleteFriend(
    @Param('id') channelId: number,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.channelService.deleteMember(channelId, userId);
  }
}
