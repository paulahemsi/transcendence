import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ConnnectedUsersService } from 'src/connected-users/connected-users.service';
import { User } from 'src/entity';
import { status } from 'src/entity/user.entity';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { UsersService } from 'src/users/users.service';

interface Player {
  socket: Socket;
  userId: string;
}

interface MatchInfos {
  id: number;
  player1: string;
  player2: string;
}

interface Game {
  room: number;
  player1: string;
  player2: string;
}

interface GameAnswer {
  room: number;
  accepted: boolean;
}

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
    private readonly usersService: UsersService,
    private readonly matchHistoryService: MatchHistoryService,
  ) {}
  private logger: Logger = new Logger('SessionGateway');

  @WebSocketServer()
  server: Server;
  gameQueue: Array<Player> = [];

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
      this.setStatusOnline(user);
    } catch {
      client.emit('error', new UnauthorizedException());
      this.disconnect(client);
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.connectedUsersService.delete(client.id);
    this.setStatusOffline(await client.data.user);
    this.disconnect(client);
  }

  @SubscribeMessage('status')
  handleStatus(client: Socket, message: string) {
    client.emit('status', message);
  }

  @SubscribeMessage('joinGameQueue')
  async handleJoinGameQueue(@ConnectedSocket() client: Socket) {
    const player: Player = {
      socket: client,
      userId: client.data.user.id,
    };
    if (this.gameQueue.length > 0) {
      const otherPlayer = this.gameQueue.pop();
      const match = await this.matchHistoryService.createMatch(
        player.userId,
        otherPlayer.userId,
      );

      const matchInfos: MatchInfos = {
        id: match.id,
        player1: match.player1.id,
        player2: match.player2.id,
      };

      otherPlayer.socket.emit('joinGameQueue', matchInfos);
      player.socket.emit('joinGameQueue', matchInfos);
    } else {
      this.gameQueue.push(player);
    }
  }

  @SubscribeMessage('playWithFriend')
  async handlePlayWithFriend(client: Socket, game: Game) {
    if (client.data.user.id == game.player1) {
      this.server.emit('playWithFriend', game);
    }
  }

  @SubscribeMessage('answerToGameRequest')
  async handleAnswerGameRequest(client: Socket, gameAnswer: GameAnswer) {
    this.server.emit('answerToGameRequest', gameAnswer);
  }

  private disconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.disconnect();
  }

  private async setStatusOnline(user: User) {
    await this.usersService.getStatus(user.id);
    if (user.status == status.OFFLINE) {
      this.usersService.setStatusOnline(user.id);
    }
  }

  private async setStatusOffline(user: User) {
    if (!user) {
      return;
    }
    if (await this.connectedUsersService.hasConnections(user)) {
      return;
    }
    this.usersService.setStatusOffline(user.id);
  }
}
