import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from 'src/entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

type friendInfo = {
  username: string;
  status: string;
  rating: number;
  image_url: string;
};

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friedshipRepository: Repository<Friendship>,
    private readonly usersService: UsersService,
  ) {}

  private findOneFriendship(
    userId: string,
    friendId: string,
  ): Promise<Friendship> {
    return this.friedshipRepository.findOne({
      relations: {
        user: true,
        friend: true,
      },
      where: {
        user: { id: userId },
        friend: { id: friendId },
      },
    });
  }

  private findAllFriends(userId: string): Promise<Friendship[]> {
    return this.friedshipRepository.find({
      relations: {
        user: true,
        friend: true,
      },
      where: [{ user: { id: userId } }],
    });
  }

  private async checkUserAndFriend(userId: string, friendId: string) {
    const user = await this.usersService.findUser(userId);
    const friend = await this.usersService.findUser(friendId);
    if (!friend || !user) {
      throw new NotFoundException();
    }
    return { user: user, friend: friend };
  }

  async addFriend(userId: string, friendId: string) {
    const { user, friend } = await this.checkUserAndFriend(userId, friendId);
    let friendship = await this.findOneFriendship(userId, friendId);
    if (friendship) {
      return;
    }
    friendship = this.friedshipRepository.create({
      user: user,
      friend: friend,
    });
    return this.friedshipRepository.save(friendship);
  }

  async addFriendByName(userId: string, friendName: string) {
    const friend = await this.usersService.findUserByName(friendName);
    if (!friend) {
      throw new NotFoundException();
    }
    return this.addBilateralFriendship(userId, friend.id);
  }

  async addBilateralFriendship(userId: string, friendId: string) {
    this.addFriend(userId, friendId);
    this.addFriend(friendId, userId);
  }

  async deleteFriend(userId: string, friendId: string) {
    await this.checkUserAndFriend(userId, friendId);
    const friendship = await this.findOneFriendship(userId, friendId);
    if (!friendship) {
      throw new NotFoundException();
    }
    this.friedshipRepository.delete(friendship.id);
  }

  async getFriends(userId: string) {
    const friendshipList: Awaited<Promise<Friendship[]>> =
      await this.findAllFriends(userId);
    const friends: Array<friendInfo> = [];

    friendshipList.map((friendship) => {
      const friend = {} as friendInfo;

      friend.username = friendship.friend.username;
      friend.status = friendship.friend.status;
      friend.rating = friendship.friend.rating;
      friend.image_url = friendship.friend.image_url;
      friends.push(friend);
    });

    return friends;
  }
}
