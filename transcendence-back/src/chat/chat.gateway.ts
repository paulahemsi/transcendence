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
    @MessageBody() message: ChatMessagelDto,
  ) {
    await this.channelService.addChatMessage(message);
    this.server.to(message.channel.toString()).emit('chatMessage', message);
    //this.server.emit('chatMessage', message);
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
}
