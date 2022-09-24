import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelDto } from 'src/dto/channel.dtos';
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
  
  async update(id: number, channelDto: ChannelDto) {
    console.log("update channel", id)
    const channel = await this.findChannel(id);
    if (!channel) {
      throw new NotFoundException();
    }
  }
}
