import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  async use(request: Request, response: Response, next: NextFunction) {
    const tokenArray: string[] = request.headers['authorization'].split(' ');
    console.log(tokenArray);
    next();
  }
}
