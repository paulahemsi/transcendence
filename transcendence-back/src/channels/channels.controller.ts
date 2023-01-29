import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  CreateChannelDto,
  MessagelDto,
  UpdateChannelDto,
} from 'src/dto/channel.dtos';
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

  @Get(':id')
  getChannelData(@Param('id') channelId: number) {
    return this.channelService.getChannelData(channelId);
  }

  @Post(':id/members')
  @HttpCode(204)
  joinChannel(
    @Param('id') channelId: number,
    @Body('userId', ParseUUIDPipe) userId: string,
    @Body('password') password: string,
  ) {
    return this.channelService.joinChannel(channelId, userId, password);
  }

  @Patch(':id/members')
  @HttpCode(204)
  addMember(
    @Param('id') channelId: number,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.channelService.addMember(channelId, userId);
  }

  @Delete(':channelId/members/:userId')
  deleteMember(
    @Param('channelId') channelId: number,
    @Param('userId') userId: string,
  ) {
    return this.channelService.deleteMember(channelId, userId);
  }

  @Delete('leave/:channelId')
  leaveChannel(@Param('channelId') channelId: number, @Req() request: Request) {
    const userId = request.user;
    return this.channelService.leave(channelId, `${userId}`);
  }

  @Get(':id/members')
  getMembers(@Param('id') channelId: number) {
    return this.channelService.getMembers(channelId);
  }

  @Get('')
  getPublicChannels() {
    return this.channelService.getPublicChannels();
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
  deleteAdmin(@Param('id') channelId: number, @Param('userId') userId: string) {
    return this.channelService.deleteAdmin(channelId, userId);
  }

  @Post(':id/messages')
  @HttpCode(204)
  addMessage(@Param('id') channelId: number, @Body() message: MessagelDto) {
    return this.channelService.addMessage(channelId, message);
  }

  @Get(':id/messages')
  getMessages(@Param('id') channelId: number) {
    return this.channelService.getMessages(channelId);
  }

  @Post()
  @HttpCode(200)
  addChannel(@Body() channel: CreateChannelDto) {
    return this.channelService.addChannel(channel);
  }
}
