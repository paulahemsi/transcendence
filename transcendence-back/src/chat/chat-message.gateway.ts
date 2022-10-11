import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';

export class message {
  channel: string;
  text: string;
}

@WebSocketGateway({ namespace: '/chat' })
export class ChatMessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatMessageGateway');

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
  handleMessage(client: Socket, message: message) {
    console.log(message);
    client.broadcast.to(message.channel).emit('chatMessage', message.text);
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
