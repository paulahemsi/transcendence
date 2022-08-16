import { Injectable } from '@nestjs/common';

export interface AuthenticationInterface {
  createUser();
  validateUser();
  findUser();
}

@Injectable()
export class AuthService implements AuthenticationInterface {
  createUser() {
    throw new Error('I did not implement method "createUser" yet. Oops!');
  }

  validateUser() {
    throw new Error('I did not implement method "validateUser" yet. Oops!');
  }

  findUser() {
    throw new Error('I did not implement method "findUser" yet. Oops!');
  }
}
