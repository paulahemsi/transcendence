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
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { SessionGateway } from 'src/session/session.gateway';

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
  room: number;
  score: Score;
}

interface MatchInfos {
  id: string;
  player1: string;
  player2: string;
}

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: process.env.FRONT_HOST,
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly matchHistoryService: MatchHistoryService,
    private readonly sessionGateway: SessionGateway,
  ) {}
  private logger: Logger = new Logger('GameGateway');

  @WebSocketServer()
  server: Server;
  clientRoom: Map<string, string> = new Map();
  userRoom: Map<string, MatchInfos> = new Map();

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
      client.emit('error', new UnauthorizedException());
      this.disconnect(client);
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const gameRoom = this.clientRoom.get(client.id);
    this.clientRoom.delete(client.id);
    if (client.data.user) {
      this.userRoom.delete(client.data.user.id);
    }
    this.server.to(gameRoom).emit('stopGame', 'stop');
    client.disconnect();
  }

  private disconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.disconnect();
  }

  @SubscribeMessage('joinGameRoom')
  handleJoinGameRoom(client: Socket, matchInfos: MatchInfos) {
    const gameRoom = matchInfos.id;
    client.join(gameRoom);
    this.clientRoom.set(client.id, gameRoom);
    this.userRoom.set(client.data.user.id, matchInfos);
    this.sessionGateway.setStatusInGame(client.data.user);
    client.emit('joinGameRoom', gameRoom);
  }

  @SubscribeMessage('joinGameRoomAsSpectator')
  handleJoinGameRoomAsSpectator(client: Socket, gameRoom: string) {
    client.join(gameRoom);
    client.emit('joinGameRoomAsSpectator', gameRoom);
  }

  @SubscribeMessage('leaveGameRoom')
  handleLeaveGameRoom(client: Socket, gameRoom: string) {
    client.leave(gameRoom);
    this.clientRoom.delete(client.id);
    if (client.data.user) {
      this.userRoom.delete(client.data.user.id);
    }
    this.sessionGateway.setStatusOnline(client.data.user);
    client.emit('leaveGameRoom', gameRoom);
  }

  @SubscribeMessage('leaveGameRoomAsSpectator')
  handleLeaveGameRoomAsSpectator(client: Socket, gameRoom: string) {
    client.leave(gameRoom);
    client.emit('leaveGameRoomAsSpectator', gameRoom);
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
    this.server.to(scoreDto.room.toString()).emit('score', scoreDto.score);
  }

  @SubscribeMessage('computeMatch')
  handleComputeMatch(client: Socket, scoreDto: ScoreDto) {
    this.matchHistoryService.setScore(
      scoreDto.room,
      scoreDto.score.player1,
      scoreDto.score.player2,
    );
  }

  @SubscribeMessage('watchGame')
  handleWatchGame(client: Socket, friendId: string) {
    const matchInfos = this.userRoom.get(friendId);
    client.emit('watchGame', matchInfos);
  }
}
