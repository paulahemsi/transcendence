import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagelDto, UpdateChannelDto } from 'src/dto/channel.dtos';
import {
  Channel,
  ChannelAdmin,
  ChannelMember,
  Message,
  User,
} from 'src/entity';
import { BadRequestException } from '@nestjs/common';
import { CreateChannelDto } from 'src/dto/channel.dtos';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ChannelTypeService } from './channel-type.service';
import * as bcrypt from 'bcrypt';
import { ChatMessagelDto } from 'src/dto/chat.dtos';
import { channelType } from 'src/entity/channel-type.entity';
import { type } from 'os';

type members = {
  id: string;
  name: string;
};

type channelMessage = {
  message: string;
  username: string;
  userId: string;
  creationDate: object;
};

type channelData = {
  id: number;
  name: string;
  type: string;
}

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
    return this.channelRepository.findOne({
      relations: {
        type: true,
      },
      where: {
        id: id,
      }
      });
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

  authorizedMember(channel: Channel, password: string) {
    if (channel.type.type != channelType.PROTECTED) {
      return true;
    }
    if (bcrypt.compareSync(password, channel.password)) {
      return true;
    }
    return false;
  }
  
  async addMember(channelId: number, userId: string, password: string) {
    const { channel, user } = await this.checkChannelAndMember(
      channelId,
      userId,
    );
    if (
      await this.alreadyExists(channelId, userId, this.channelMemberRepository)
    ) {
      return;
    }
    if (this.authorizedMember(channel, password)) {
      const newMember = this.createMemberEntity(user, channel);
      this.channelMemberRepository.save(newMember);
    }
    else {
      throw new ForbiddenException();
    }
  }

  createMemberEntity(user: User, channel: Channel) {
    return this.channelMemberRepository.create({
      channel: channel,
      user: user,
    });
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

  //TODO: remover se a gente não for usar o endpoint
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

  async addChatMessage(chatMessageDto: ChatMessagelDto) {
    const { channel, user } = await this.checkChannelAndMember(
      chatMessageDto.channel,
      chatMessageDto.user,
    );

    const newMessage: Message = this.channelMessageRepository.create({
      message: chatMessageDto.message,
      channel: channel,
      user: user,
    });
    return this.channelMessageRepository.save(newMessage);
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
      order: {
        createdDate: 'ASC',
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
      message.userId = element.user.id;
      message.creationDate = element.createdDate;
      channelMessages.push(message);
    });
    return channelMessages;
  }

  private async nameAlreadyUsed(name: string) {
    const channel = await this.channelRepository.findOneBy({ name });
    if (channel) {
      return true;
    }
    return false;
  }

  async addChannel(channelDto: CreateChannelDto) {
    if (await this.nameAlreadyUsed(channelDto.name)) {
      throw new BadRequestException('Channel name alredy exists');
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
    //const salt = await bcrypt.genSalt();

    const channel = this.channelRepository.create({
      name: channelDto.name,
      owner: user,
      type: type,
      password: channelDto.password
        ? await bcrypt.hash(channelDto.password, bcrypt.genSaltSync())
        : null,
    });
    const newChannel = await this.channelRepository.save(channel);
    this.addMember(newChannel.id, user.id, "");
    return { id: newChannel.id, name: newChannel.name };
  }

  deleteChannel(channel: Channel) {
    this.channelRepository.delete(channel.id);
  }

  async createDirectMessageChannelEntity(user: User) {
    const type = await this.channelTypeService.getChannelType(
      channelType.DIRECT_MESSAGES,
    );
    const channel = this.channelRepository.create({
      name: 'directMessage',
      type: type,
      owner: user,
    });
    return channel;
  }

  async getAllPublicChannels() {
    const publicMessageType = await this.channelTypeService.getChannelType(
      channelType.PUBLIC,
    );
    const protectedMessageType = await this.channelTypeService.getChannelType(
      channelType.PROTECTED,
    );
    
    return await this.channelRepository.find({
      relations: {
        type: true,
      },
      where: [
      {
        type: { id: publicMessageType.id },
      },
      {
        type: { id: protectedMessageType.id },
      }
    ],
    });
  }

  async getPublicChannels() {

    const channels = await this.getAllPublicChannels();
    const channelsResponse: Array<channelData> = [];

    channels.map((channel) => {
      const channelData = {} as channelData;

      channelData.id = channel.id;
      channelData.name = channel.name;
      channelData.type = channel.type.type;
      channelsResponse.push(channelData);
    })
    
    return channelsResponse;
  }
}
