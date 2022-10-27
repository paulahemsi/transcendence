import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ConnnectedUsersService } from 'src/connected-users/connected-users.service';

@WebSocketGateway({ namespace: '/session' })
export class SessionGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  constructor(
    private readonly authService: AuthService,
    private readonly connectedUsersService: ConnnectedUsersService,
  ) {}
  private logger: Logger = new Logger('SessionGateway');

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.connectedUsersService.deleteAll();
  }

  afterInit() {
    this.logger.log('Initialize');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.cookie.split('=')[1];
      const decodedToken = this.authService.validateJwt(token);
      const user = await this.authService.validateUser(decodedToken.id);
      client.data.user = user;
      await this.connectedUsersService.create(client.id, user);
    } catch {
      this.disconnect(client);
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsersService.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
    client.disconnect();
  }

  @SubscribeMessage('status')
  handleStatus(client: Socket, message: string) {
    client.emit('status', message);
  }

  private disconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.emit('error', new UnauthorizedException());
    client.disconnect();
  }
}
