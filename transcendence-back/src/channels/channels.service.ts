import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateChannelDto } from 'src/dto/channel.dtos';
import { Channel, ChannelMember } from 'src/entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private readonly channelMemberRepository: Repository<ChannelMember>,
    private readonly usersService: UsersService,
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
  
  async addMember(channelId: number, userId: string) {
   const channel = await this.findChannel(channelId);
   const user = await this.usersService.findUser(userId);
   if (!channel || !user) {
      throw new NotFoundException();
    }
    const newMember = this.channelMemberRepository.create({
      channel: channel,
      user: user
    });
    this.channelMemberRepository.save(newMember);
  }
}
