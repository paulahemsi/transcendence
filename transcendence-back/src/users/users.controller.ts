import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  findUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findUser(id);
  }
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id/profile')
  getUserProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserProfile(id);
  }
}
