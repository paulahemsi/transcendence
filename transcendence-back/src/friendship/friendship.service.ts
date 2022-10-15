import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship, User } from 'src/entity';
import { DataSource, Repository } from 'typeorm';
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
    private dataSource: DataSource,
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

  async createFriendshipByName(userId: string, friendName: string) {
    const friend = await this.usersService.findUserByName(friendName);
    if (!friend) {
      throw new NotFoundException();
    }
    return this.createFriendship(userId, friend.id);
  }

  private async checkAndCreateFriendship(user: User, friend: User) {
    let friendship = await this.findOneFriendship(user.id, friend.id);
    if (friendship) {
      throw new BadRequestException('users alredy friends');
    }

    friendship = this.friedshipRepository.create({
      user: user,
      friend: friend,
    });
    return friendship;
  }

  async createFriendship(userId: string, friendId: string) {
    const { user, friend } = await this.checkUserAndFriend(userId, friendId);
    const friendship1 = await this.checkAndCreateFriendship(user, friend);
    const friendship2 = await this.checkAndCreateFriendship(friend, user);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(friendship1);
      await queryRunner.manager.save(friendship2);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFriendship(userId: string, friendId: string) {
    await this.checkUserAndFriend(userId, friendId);
    const friendship1 = await this.findOneFriendship(userId, friendId);
    const friendship2 = await this.findOneFriendship(friendId, userId);
    if (!friendship1 || !friendship2) {
      throw new NotFoundException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.remove(friendship1);
      await queryRunner.manager.remove(friendship2);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
