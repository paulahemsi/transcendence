import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AddFriendDto } from 'src/dto/friend.dtos';
import { UpdateUserDto } from 'src/dto/users.dtos';
import { FriendshipService } from '../friendship/friendship.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly friedshipService: FriendshipService,
  ) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  findUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findUser(id);
  }

  @Patch(':id')
  @HttpCode(204)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.userService.update(id, userDto);
  }

  @Get(':id/profile')
  getUserProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserProfile(id);
  }

  @Post(':id/friend')
  addFriend(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() friend: AddFriendDto,
  ) {
    return this.friedshipService.addFriend(userId, friend.id);
  }
}
