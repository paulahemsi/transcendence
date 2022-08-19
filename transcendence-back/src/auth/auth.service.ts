import { Injectable } from '@nestjs/common';

export interface AuthenticationInterface {
  intraLogin();
  intraRedirect();
  createUser();
  validateUser();
  findUser();
  getUserStatus();
  logoutUser();
}

@Injectable()
export class AuthService implements AuthenticationInterface {
  intraLogin() {
    throw new Error('I did not implement method "intraLogin" yet. Oops!');
  }

  intraRedirect() {
    throw new Error('I did not implement method "intraRedirect" yet. Oops!');
  }

  createUser(){
    throw new Error('I did not implement method "createUser" yet. Oops!');
  }

  validateUser() {
    throw new Error('I did not implement method "validateUser" yet. Oops!');
  }

  findUser() {
    throw new Error('I did not implement method "findUser" yet. Oops!');
  }

  getUserStatus() {
    throw new Error('I did not implement method "getUserStatus" yet. Oops!');
  }

  logoutUser() {
    throw new Error('I did not implement method "logoutUser" yet. Oops!');
  }
}
