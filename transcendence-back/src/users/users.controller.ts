import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { FriendDto } from 'src/dto/friend.dtos';
import { UpdateUserDto } from 'src/dto/users.dtos';
import { FriendshipService } from '../friendship/friendship.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly friedshipService: FriendshipService,
  ) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  findUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findUser(id);
  }

  @Patch(':id')
  @HttpCode(204)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, userDto);
  }

  @Get(':id/profile')
  getUserProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserProfile(id);
  }

  @Post(':id/friends')
  @HttpCode(204)
  addFriend(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() friend: FriendDto,
  ) {
    return this.friedshipService.addFriend(userId, friend.id);
  }

  @Get(':id/friends')
  getFriends(@Param('id', ParseUUIDPipe) userId: string) {
    return this.friedshipService.getFriends(userId);
  }

  @Delete(':id/friends')
  deleteFriend(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() friend: FriendDto,
  ) {
    return this.friedshipService.deleteFriend(userId, friend.id);
  }
}
