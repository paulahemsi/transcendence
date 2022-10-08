import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');

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

  //só retorna pro client
  @SubscribeMessage('messageToServer0')
  handleMessage0(client: Socket, text: string) {
    client.emit('messageToClient', text);
  }

  //só retorna pro client ou pra todos??
  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, text: string): string {
    return text;
  }

  //retorna pra todos que escutam esse evento
  @SubscribeMessage('messageToServer1')
  handleMessage1(client: Socket, text: string): WsResponse<string> {
    return { event: 'messageToClient', data: text };
  }

  //retorna pra todos que escutam esse evento
  @SubscribeMessage('messageToServer2')
  handleMessage2(client: Socket, text: string) {
    this.logger.log(`message to server: ${client.id} ${text}`);
    client.broadcast.emit('messageToClient', text);
  }
}
