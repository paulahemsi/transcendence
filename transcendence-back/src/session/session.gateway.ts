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

export interface MatchInviteAnswer {
  matchInfos: MatchInfos;
  accepted: boolean;
}

@WebSocketGateway({
  namespace: '/session',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
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
  
  playerAlreadyInQueue(playerId: string) {
    if (this.gameQueue.filter((p: {[key: string]: any}) => p.userId === playerId).length) {
      return true;
    }
    return false;
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
    if (this.playerAlreadyInQueue(client.data.user.id)) {
      return ;
    }
    if (this.gameQueue.length > 0) {
      const otherPlayer = this.gameQueue.pop();
      const matchInfos = await this.createMatch(
        player.userId,
        otherPlayer.userId,
      );
      otherPlayer.socket.emit('joinGameQueue', matchInfos);
      player.socket.emit('joinGameQueue', matchInfos);
    } else {
      this.gameQueue.push(player);
    }
  }

  async createMatch(playerId1: string, playerId2: string) {
    const match = await this.matchHistoryService.createMatch(
      playerId1,
      playerId2,
    );

    const matchInfos: MatchInfos = {
      id: match.id,
      player1: match.player1.id,
      player2: match.player2.id,
    };
    return matchInfos;
  }

  @SubscribeMessage('playWithFriend')
  async handlePlayWithFriend(client: Socket, friendId: string) {
    const matchInfos = await this.createMatch(client.data.user.id, friendId);
    this.server.emit('playWithFriend', matchInfos);
  }

  @SubscribeMessage('answerToGameRequest')
  async handleAnswerGameRequest(
    client: Socket,
    matchInviteAnswer: MatchInviteAnswer,
  ) {
    this.server.emit('answerToGameRequest', matchInviteAnswer);
  }

  @SubscribeMessage('refreshFriends')
  async handleRefreshFriends(client: Socket, message: string) {
    this.server.emit('refreshFriends');
  }

  private disconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.disconnect();
  }

  async setStatusOnline(user: User) {
    this.usersService
      .setStatusOnline(user.id)
      .then(() => this.server.emit('refreshFriends'));
  }

  private async setStatusOffline(user: User) {
    if (!user) {
      return;
    }
    if (await this.connectedUsersService.hasConnections(user)) {
      return;
    }
    this.usersService
      .setStatusOffline(user.id)
      .then(() => this.server.emit('refreshFriends'));
  }

  async setStatusInGame(user: User) {
    this.usersService
      .setStatusInGame(user.id)
      .then(() => this.server.emit('refreshFriends'));
  }
}
