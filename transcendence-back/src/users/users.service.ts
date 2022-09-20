import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/dto/users.dtos';
import { User } from 'src/entity';
import { Repository } from 'typeorm';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { Intra42UserData } from 'src/auth/strategies/intra42.strategy';

export class matchInfos {
  opponent: string;
  userScore: number;
  opponentScore: number;
  isWinner: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly matchHistoryService: MatchHistoryService,
  ) {}

  getUsers() {
    return this.userRepository.find();
  }

  findUser(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async getUserProfile(id: string) {
    const { username, rating, status, image_url } = await this.findUser(id);

    const profile = {
      name: username,
      image_url: image_url,
      status: status,
      rating: rating,
      matchHistory: await this.matchHistoryService.buildMatchHistory(id),
    };

    return profile;
  }

  findUserByExternalId(external_id: number): Promise<User> {
    const user = this.userRepository.findOneBy({ external_id });
    return user;
  }

  async validate(intra42User: Intra42UserData) {
    const user = await this.findUserByExternalId(intra42User.external_id);
    if (user) return user;
    return this.create(intra42User);
  }

  create(userInfo: Intra42UserData): Promise<User> {
    const newUser: User = this.userRepository.create({
      username: userInfo.username,
      email: userInfo.email,
      external_id: userInfo.external_id,
      image_url: userInfo.image_url,
      rating: 0,
    });
    return this.userRepository.save(newUser);
  }

  async update(id: string, userDto: UpdateUserDto) {
    const user = await this.findUser(id);
    if (!user) {
      throw new NotFoundException();
    }
    user.update(userDto);
    this.userRepository.save(user);
  }
}
