import { Body, Controller, HttpCode, Param, Patch } from '@nestjs/common';
import { ChannelDto } from 'src/dto/channel.dtos';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelService: ChannelsService) {}
  
  @Patch(':id')
  @HttpCode(204)
  updateUser(
    @Param('id') id: number,
    @Body() channelDto: ChannelDto,
  ) {
    return this.channelService.update(id, channelDto);
  }
}
