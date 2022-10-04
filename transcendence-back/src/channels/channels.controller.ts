import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { MessagelDto, UpdateChannelDto } from 'src/dto/channel.dtos';
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

  @Get(':id/members')
  getMembers(
    @Param('id') channelId: number,
  ) {
    return this.channelService.getMembers(channelId);
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

  @Post(':id/messages')
  @HttpCode(204)
  addMessage(
    @Param('id') channelId: number,
    @Body() message : MessagelDto
  ) {
   return this.channelService.addMessage(channelId, message);
  }
}
