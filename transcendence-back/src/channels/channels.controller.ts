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
  addMember(
    @Param('id') channelId: number,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
   return this.channelService.addMember(channelId, userId);
  }

  @Delete(':id/members')
  deleteMember(
    @Param('id') channelId: number,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.channelService.deleteMember(channelId, userId);
  }

  @Post(':id/admin')
  @HttpCode(204)
  addAdmin(
    @Param('id') channelId: number,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
   return this.channelService.addAdmin(channelId, userId);
  }

  @Delete(':id/admin')
  deleteAdmin(
    @Param('id') channelId: number,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.channelService.deleteAdmin(channelId, userId);
  }
}
