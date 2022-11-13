import {
	Injectable,
	InternalServerErrorException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { ChannelsService } from 'src/channels/channels.service';
  import { Friendship, Blocked, User } from 'src/entity';
  import { Repository } from 'typeorm';
import { FriendshipService } from './friendship.service';

type blockedFriendInfo = {
	username: string;
	id: string;
  };

  @Injectable()
  export class BlockedService {
	constructor(
		@InjectRepository(Blocked)
		private readonly blockedRepository: Repository<Blocked>,
		@InjectRepository(Friendship)
		private readonly friedshipRepository: Repository<Friendship>,
		private readonly channelsService: ChannelsService,
		private readonly firendshipService: FriendshipService,
	) {}
	
	private async createBlockedEntity(
		user: User,
		friend: User,
	  ) {
		const blocked = this.blockedRepository.create({
		  user: user,
		  friend: friend,
		});
		return blocked;
	  }
	  
	  private async deleteFriendship(userId: string, friendId: string) {
		const friendship1 = await this.firendshipService.findOneFriendship(userId, friendId);
		this.friedshipRepository.delete({id: friendship1.id});
		const friendship2 = await this.firendshipService.findOneFriendship(friendId, userId);
		this.friedshipRepository.delete({id: friendship2.id});
		this.channelsService.deleteChannel(friendship1.channel);
	  }
	  
	  private async block(user: User, friend: User){
		const queryRunner = await this.firendshipService.createTransaction();
		try {
		const blocked1 = this.createBlockedEntity(user, friend);
		const blocked2 = this.createBlockedEntity(friend, user);
		await queryRunner.manager.save(await blocked1);
		await queryRunner.manager.save(await blocked2);
		await queryRunner.commitTransaction();
		} catch (err) {
		await queryRunner.rollbackTransaction();
		throw new InternalServerErrorException('Fail to create friendship');
		} finally {
		await queryRunner.release();
		}
	  }
  
	  async blockFriend(userId: string, friendId: string) {
		const { user, friend } = await this.firendshipService.checkUserAndFriend(userId, friendId);
	
		await this.deleteFriendship(user.id, friend.id);
		await this.block(user, friend);
	  }
	  
	  private findAllBlockedFriends(userId: string): Promise<Blocked[]> {
		return this.blockedRepository.find({
		  relations: {
			user: true,
			friend: true,
		  },
		  where: [{ user: { id: userId } }],
		});
	  }
	  
	  async getBlockedFriends(userId: string) {
		const blockedList: Awaited<Promise<Blocked[]>> =
		  await this.findAllBlockedFriends(userId);
		const blockedFriends: Array<blockedFriendInfo> = [];
	
		blockedList.map((block) => {
		  const friend = {} as blockedFriendInfo;
	
		  friend.username = block.friend.username;
		  friend.id = block.friend.id;
		  blockedFriends.push(friend);
		});
	
		return blockedFriends;
	  }
  }
