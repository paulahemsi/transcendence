import { Logger } from '@nestjs/common';
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
  channel: string;
  duration: number;
}


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly channelService: ChannelsService) {}
  private logger: Logger = new Logger('ChatGateway');

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Initialize');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chatMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatMessageDto: ChatMessagelDto,
  ) {
    var newMessage : Message;
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
      
    this.server.to(chatMessageDto.channel.toString()).emit('chatMessage', message);
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
  handleMuteUser(client: Socket, muteEvent: muteEvent) {
    console.log('muteEvent')
    console.log(muteEvent)
    this.server.to(muteEvent.channel.toString()).emit('muteUser', 'alguém foi mutado')
  }
}
