import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from 'src/entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

export class friendInfo {
  username: string;
  status: string;
  rating: number;
}

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friedshipRepository: Repository<Friendship>,
    private readonly userService: UsersService,
  ) {}

  findOneFriendship(userId: string, friendId: string) : Promise<Friendship> {
      
    return this.friedshipRepository.findOne({
      relations: {
        user: true,
        friend: true,
      },
      where: {
        user: { id: userId },
        friend: { id: friendId}
      }
    })
  }
    
  findAllFriends(userId: string) : Promise<Friendship[]> {
    
    return this.friedshipRepository.find({
      relations: {
        user: true,
        friend: true,
      },
      where: [
        { user: { id: userId } }
      ]
    });
  }

  async checkUserAndFriend(userId: string, friendId: string) {
    const user = await this.userService.findUser(userId);
    const friend = await this.userService.findUser(friendId);
    if (!friend || !user) {
      throw new NotFoundException();
    }
  }
  
  async addFriend(userId: string, friendId: string) {
    const user = await this.userService.findUser(userId);
    const friend = await this.userService.findUser(friendId);
    if (!friend || !user) {
      throw new NotFoundException();
    }
    console.log('implementação');
  }

  async deleteFriend(userId: string, friendId: string) {
    await this.checkUserAndFriend(userId, friendId);
    const friendship = await this.findOneFriendship(userId, friendId); 
    if (!friendship) {
      throw new NotFoundException();
    }
    this.friedshipRepository.delete(friendship.id)
  }

  async getFriends(userId: string) {

    const friendshipList: Awaited<Promise<Friendship[]>> = await this.findAllFriends(userId); 
    
    let friends: Array<friendInfo> = [];
    
    friendshipList.map( (friendship) => {
      let friend : friendInfo = new friendInfo();

			friend.username = friendship.friend.username;
			friend.status = friendship.friend.status;
			friend.rating = friendship.friend.rating;
      friends.push(friend);
    })
    
    return friends;
  }
}
