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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    DatabaseModule,
    UsersModule,
    ChannelsModule,
    AuthModule,
    ChatModule,
    SessionModule,
    ImagesModule,
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
        { path: '/images/:path', method: RequestMethod.GET },
      )
      .forRoutes('');
  }
}
