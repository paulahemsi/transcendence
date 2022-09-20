import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagelDto, UpdateChannelDto } from 'src/dto/channel.dtos';
import { Channel, ChannelAdmin, ChannelMember, Message } from 'src/entity';
import { BadRequestException } from '@nestjs/common';
import { CreateChannelDto } from 'src/dto/channel.dtos';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ChannelTypeService } from './channel-type.service';

type members = {
  id: string;
  name: string;
};

type channelMessage = {
  message: string;
  username: string;
};

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private readonly channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(ChannelAdmin)
    private readonly channelAdminRepository: Repository<ChannelAdmin>,
    @InjectRepository(Message)
    private readonly channelMessageRepository: Repository<Message>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly channelTypeService: ChannelTypeService,
  ) {}

  findChannel(id: number) {
    return this.channelRepository.findOneBy({ id });
  }

  private async checkChannel(channelId: number) {
    const channel = await this.findChannel(channelId);
    if (!channel) {
      throw new NotFoundException();
    }
    return channel;
  }

  private async checkChannelAndMember(channelId: number, userId: string) {
    const channel = await this.findChannel(channelId);
    const user = await this.usersService.findUser(userId);
    if (!channel || !user) {
      throw new NotFoundException();
    }
    return { channel: channel, user: user };
  }

  private async alreadyExists(
    channelId: number,
    userId: string,
    repository: any,
  ) {
    const relationExists = await repository.findOne({
      relations: {
        channel: true,
        user: true,
      },
      where: {
        channel: { id: channelId },
        user: { id: userId },
      },
    });
    if (relationExists) {
      return true;
    }
    return false;
  }

  private async getChannelInfos(channelId: number) {
    const channels = await this.channelMemberRepository.find({
      relations: {
        channel: true,
        user: true,
      },
      where: {
        channel: { id: channelId },
      },
    });
    return channels;
  }

  async update(id: number, channelDto: UpdateChannelDto) {
    const channel = await this.checkChannel(id);
    channel.update(channelDto);
    this.channelRepository.save(channel);
  }

  async deleteMember(channelId: number, userId: string) {
    await this.checkChannelAndMember(channelId, userId);
    const member = await this.channelMemberRepository.findOne({
      relations: {
        channel: true,
        user: true,
      },
      where: {
        channel: { id: channelId },
        user: { id: userId },
      },
    });
    this.channelMemberRepository.delete(member.id);
  }

  async addMember(channelId: number, userId: string) {
    const { channel, user } = await this.checkChannelAndMember(
      channelId,
      userId,
    );
    if (
      await this.alreadyExists(channelId, userId, this.channelMemberRepository)
    ) {
      return;
    }
    const newMember = this.channelMemberRepository.create({
      channel: channel,
      user: user,
    });
    this.channelMemberRepository.save(newMember);
  }

  async getMembers(channelId: number) {
    await this.checkChannel(channelId);
    const channelInfos = await this.getChannelInfos(channelId);

    const channelMembers: Array<members> = [];
    channelInfos.map((element) => {
      const member = {} as members;
      member.id = element.user.id;
      member.name = element.user.username;
      channelMembers.push(member);
    });
    return channelMembers;
  }

  async deleteAdmin(channelId: number, userId: string) {
    await this.checkChannelAndMember(channelId, userId);
    const admin = await this.channelAdminRepository.findOne({
      relations: {
        channel: true,
        user: true,
      },
      where: {
        channel: { id: channelId },
        user: { id: userId },
      },
    });
    this.channelAdminRepository.delete(admin.id);
  }

  async addAdmin(channelId: number, userId: string) {
    const { channel, user } = await this.checkChannelAndMember(
      channelId,
      userId,
    );
    if (
      await this.alreadyExists(channelId, userId, this.channelAdminRepository)
    ) {
      return;
    }
    const newAdmin = this.channelAdminRepository.create({
      channel: channel,
      user: user,
    });
    this.channelAdminRepository.save(newAdmin);
  }

  async addMessage(channelId: number, messageDto: MessagelDto) {
    const { channel, user } = await this.checkChannelAndMember(
      channelId,
      messageDto.user,
    );

    const newMessage: Message = this.channelMessageRepository.create({
      message: messageDto.message,
      channel: channel,
      user: user,
    });
    this.channelMessageRepository.save(newMessage);
  }

  async getChannelMessagesInfos(channelId: number) {
    const messagesInfos = await this.channelMessageRepository.find({
      relations: {
        channel: true,
        user: true,
      },
      where: {
        channel: { id: channelId },
      },
    });

    return messagesInfos;
  }

  async getMessages(channelId: number) {
    await this.checkChannel(channelId);

    const messagesInfos = await this.getChannelMessagesInfos(channelId);

    const channelMessages: Array<channelMessage> = [];
    messagesInfos.map((element) => {
      const message = {} as channelMessage;
      message.message = element.message;
      message.username = element.user.username;
      channelMessages.push(message);
    });
    return channelMessages;
  }
  private nameAlreadyUsed(name: string): boolean {
    return false;
  }

  async addChannel(channelDto: CreateChannelDto) {
    if (this.nameAlreadyUsed(channelDto.name)) {
      throw new BadRequestException('Channel name alredy in use');
    }

    const user = await this.usersService.findUser(channelDto.owner);
    if (!user) {
      throw new BadRequestException('Invalid Owner ID');
    }

    const type = await this.channelTypeService.getChannelType(channelDto.type);
    if (!type) {
      throw new BadRequestException('Invalid Channel Type');
    }

    // TODO: regras de publico e privado
    // TODO: senha

    const channel = this.channelRepository.create({
      name: channelDto.name,
      owner: user,
      type: type,
      password: channelDto.password,
    });
    return this.channelRepository.save(channel);
  }
}
