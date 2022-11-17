import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ChannelsModule } from './channels/channels.module';
import { ChatModule } from './chat/chat.module';
import { AuthMiddleware } from './auth/auth.midlleware';
import { SessionModule } from './session/session.module';
import { ImagesModule } from './images/images.module';
import { GameModule } from './game/game.module';
import { MatchHistoryModule } from './match-history/match-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    DatabaseModule,
    UsersModule,
    ChannelsModule,
    MatchHistoryModule,
    AuthModule,
    ChatModule,
    SessionModule,
    ImagesModule,
    GameModule,
    PassportModule.register({ session: true }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.GET },
        { path: '/auth/redirect', method: RequestMethod.GET },
        { path: '/auth/logout', method: RequestMethod.GET },
        { path: '/two-factor-auth/login', method: RequestMethod.POST },
        { path: '/images/:id/:path', method: RequestMethod.GET },
      )
      .forRoutes('');
  }
}
