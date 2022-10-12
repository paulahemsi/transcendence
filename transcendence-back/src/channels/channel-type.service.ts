import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelType, channelType } from 'src/entity/channel-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelTypeService {
  constructor(
    @InjectRepository(ChannelType)
    private readonly channelTypeRepository: Repository<ChannelType>,
  ) {
    this.addChannelType(channelType.PUBLIC);
    this.addChannelType(channelType.PRIVATE);
    this.addChannelType(channelType.PROTECTED);
  }

  async addChannelType(type: channelType) {
    if (await this.channelTypeRepository.findOneBy({ type })) {
      return;
    }
    const channelType = this.channelTypeRepository.create({
      type: type,
    });
    this.channelTypeRepository.save(channelType);
  }

  async getChannelType(channelType: channelType) {
    return this.channelTypeRepository.findOneBy({ type: channelType });
  }
}
