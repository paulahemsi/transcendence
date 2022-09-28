import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateChannelDto } from 'src/dto/channel.dtos';
import { Channel } from 'src/entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}
  
  findChannel(id: number) {
    return this.channelRepository.findOneBy({ id });
  }
  
  async update(id: number, channelDto: UpdateChannelDto) {
    const channel = await this.findChannel(id);
    if (!channel) {
      throw new NotFoundException();
    }
    channel.update(channelDto);
    this.channelRepository.save(channel)
  }
}
