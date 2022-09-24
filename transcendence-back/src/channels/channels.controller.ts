import { Body, Controller, HttpCode, Param, Patch } from '@nestjs/common';
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
}
