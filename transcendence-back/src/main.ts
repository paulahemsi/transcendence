import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;
  app.enableCors();
  app.use(
    session({
      cookie: {
        maxAge: 86400000, // this is the number of miliseconds in 1 day. The session cookie will last 24h.
      },
      secret: 'dj9w8ryw47fh370w9rfhe7w9hfa379w8rgfwea78fha0783wghfa', // essa string é tirada do cu, a gente tem que arrumar algo mais seguro depois.
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(PORT, () => console.log('Running on port %d', PORT));
}
bootstrap();
