import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChannelsService } from 'src/channels/channels.service';
import { ChatMessagelDto } from 'src/dto/chat.dtos';
import { Message } from 'src/entity';

type channelMessage = {
  message: string;
  username: string;
  userId: string;
  creationDate: object;
};

type muteEvent = {
  mutedUser: string;
  channel: number;
  duration: number;
}


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly channelService: ChannelsService,
    private readonly authService: AuthService,
  ) {}
  private logger: Logger = new Logger('ChatGateway');

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Initialize');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.cookie.split('=')[1];
      const decodedToken = this.authService.validateJwt(token);
      const user = await this.authService.validateUser(decodedToken.id);
      client.data.user = user;
    } catch {
      this.disconnect(client);
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.disconnect();
  }

  @SubscribeMessage('chatMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatMessageDto: ChatMessagelDto,
  ) {
    let newMessage: Message;
    try {
      newMessage = await this.channelService.addChatMessage(chatMessageDto);
    } catch (err) {
      client.emit('chatMessage', 'error');
      return;
    }

    const message = {} as channelMessage;
    message.message = newMessage.message;
    message.username = newMessage.user.username;
    message.userId = newMessage.user.id;
    message.creationDate = newMessage.createdDate;

    this.server
      .to(chatMessageDto.channel.toString())
      .emit('chatMessage', message);
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, channel: string) {
    client.join(channel);
    client.emit('joinChannel', channel);
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(client: Socket, channel: string) {
    client.leave(channel);
    client.emit('leaveChannel', channel);
  }

  @SubscribeMessage('muteUser')
  async handleMuteUser(client: Socket, muteEvent: muteEvent) {
    try {
      await this.channelService.handleMute(muteEvent.channel, muteEvent.mutedUser, true);
    } catch (err) {
      client.emit('muteUser', false);
      return;
    }
    this.server.to(muteEvent.channel.toString()).emit('muteUser', true);
    setTimeout(() => {
      this.channelService.handleMute(muteEvent.channel, muteEvent.mutedUser, false);
      this.server.to(muteEvent.channel.toString()).emit('muteUser', true);
    }, muteEvent.duration);
  }
  
  private disconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.emit('error', new UnauthorizedException());
    client.disconnect();
  }
}
