import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelType, channelType } from 'src/entity/channel-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelTypeService {
  constructor(
    @InjectRepository(ChannelType)
    private readonly channelTypeRepository: Repository<ChannelType>,
  ) {}

  async getChannelType(channelType: channelType) {
    return this.channelTypeRepository.findOneBy({ type: channelType });
  }
}
