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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FriendDto, FriendNameDto } from 'src/dto/friend.dtos';
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

  @UseGuards(JwtAuthGuard)
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
    return this.friedshipService.createFriendship(userId, friend.id);
  }

  @Post(':id/friends/by_name')
  @HttpCode(204)
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

  @Delete(':id/friends')
  deleteFriend(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() friend: FriendDto,
  ) {
    return this.friedshipService.deleteFriendship(userId, friend.id);
  }

  @Get(':id/channels')
  getChannels(@Param('id', ParseUUIDPipe) userId: string) {
    return this.usersService.getChannels(userId);
  }
}
