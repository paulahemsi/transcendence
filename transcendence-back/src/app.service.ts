import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHelloAbacatinho(): string {
    return 'Hello Abacatinho!\n';
  }
}
