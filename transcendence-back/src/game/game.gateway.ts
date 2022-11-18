import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

interface Ball {
  x: number;
  y: number;
}

interface Score {
  player1: number;
  player2: number;
}

@WebSocketGateway({ namespace: '/game' })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly authService: AuthService) {}
  private logger: Logger = new Logger('GameGateway');

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

  private disconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.emit('error', new UnauthorizedException());
    client.disconnect();
  }

  @SubscribeMessage('joinGameRoom')
  handleJoinGameRoom(client: Socket, gameRoom: string) {
    client.join(gameRoom);
    client.emit('joinGameRoom', gameRoom);
  }

  @SubscribeMessage('leaveGameRoom')
  handleLeaveGameRoom(client: Socket, gameRoom: string) {
    client.leave(gameRoom);
    client.emit('leaveGameRoom', gameRoom);
  }

  @SubscribeMessage('player1')
  handlePlayer1(client: Socket, position: number) {
    this.server.emit('player1', position);
  }

  @SubscribeMessage('player2')
  handlePlayer2(client: Socket, position: number) {
    this.server.emit('player2', position);
  }

  @SubscribeMessage('ball')
  handleBall(client: Socket, ball: Ball) {
    this.server.emit('ball', ball);
  }

  @SubscribeMessage('score')
  handleScore(client: Socket, score: Score) {
    this.server.emit('score', score);
  }
}
