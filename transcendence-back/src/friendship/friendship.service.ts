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

  async addFriend(userId: string, friendId: string) {
    const user = await this.userService.findUser(userId);
    const friend = await this.userService.findUser(friendId);
    if (!friend || !user) {
      throw new NotFoundException();
    }
    console.log('implementação');
  }
  
  executeFriendshipQuery(userId: string) : Promise<Friendship[]> {
    
    const friendships = this.friedshipRepository.find({
      relations: {
        user: true,
        friend: true,
      },
      where: [
        { user: { id: userId } }
      ]
    });
    
    return friendships;
  }
  
  async getFriends(userId: string) {

    const friendships: Awaited<Promise<Friendship[]>> = await this.executeFriendshipQuery(userId); 
    
    let friends: Array<friendInfo> = [];
    
    friendships.map( (friendship) => {
      let friend : friendInfo = new friendInfo();

			friend.username = friendship.friend.username;
			friend.status = friendship.friend.status;
			friend.rating = friendship.friend.rating;
      friends.push(friend);
    })
    
    return friends;
  }
}
