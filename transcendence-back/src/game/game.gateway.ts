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

interface PositionDto {
  room: string;
  value: number;
}

interface BallDto {
  room: string;
  ball: Ball;
}

interface ScoreDto {
  room: string;
  score: Score;
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
  handlePlayer1(client: Socket, position: PositionDto) {
    this.server.to(position.room).emit('player1', position.value);
  }

  @SubscribeMessage('player2')
  handlePlayer2(client: Socket, position: PositionDto) {
    this.server.to(position.room).emit('player2', position.value);
  }

  @SubscribeMessage('ball')
  handleBall(client: Socket, ballDto: BallDto) {
    this.server.to(ballDto.room).emit('ball', ballDto.ball);
  }

  @SubscribeMessage('score')
  handleScore(client: Socket, scoreDto: ScoreDto) {
    this.server.to(scoreDto.room).emit('score', scoreDto.score);
  }
}
