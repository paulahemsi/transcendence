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
import { BlockedDto } from 'src/dto/blocked.dtos';
import { FriendDto, FriendNameDto } from 'src/dto/friend.dtos';
import { UpdateUserDto } from 'src/dto/users.dtos';
import { BlockedService } from 'src/friendship/blocked.service';
import { FriendshipService } from '../friendship/friendship.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly friedshipService: FriendshipService,
    private readonly blockedService: BlockedService,
  ) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  findUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUser(id);
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
  
  @Post(':id/block')
  @HttpCode(204)
  blockFriend(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() friend: BlockedDto,
  ) {
    return this.blockedService.blockFriend(userId, friend.id);
  }
  
  @Post(':id/friends')
  @HttpCode(204)
  addFriend(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() friend: FriendDto,
  ) {
    return this.friedshipService.createFriendship(userId, friend.id);
  }

  @Post(':id/friends/by_name')
  addFriendByName(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() friend: FriendNameDto,
  ) {
    return this.friedshipService.createFriendshipByName(userId, friend.name);
  }

  @Get(':id/friends')
  getFriends(@Param('id', ParseUUIDPipe) userId: string) {
    return this.friedshipService.getFriends(userId);
  }

  @Delete(':id/friends/:friendId')
  deleteFriend(
    @Param('id', ParseUUIDPipe) userId: string,
    @Param('friendId', ParseUUIDPipe) friendId: string,
  ) {
    return this.friedshipService.deleteFriendship(userId, friendId);
  }

  @Get(':id/channels')
  getChannels(@Param('id', ParseUUIDPipe) userId: string) {
    return this.usersService.getChannels(userId);
  }
}
