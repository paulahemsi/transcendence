import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/dto/users.dtos';
import { User } from 'src/entity';
import { MatchHistory } from 'src/entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(MatchHistory) private readonly matchHistoryRepository: Repository<MatchHistory>,
  ) {}

  getUsers() {
    return this.userRepository.find();
  }

  findUser(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async buildMatchHistory(matchHistory: Object, id: string) {
    
    const matches: MatchHistory[] = await this.matchHistoryRepository.find({
      select: {
        player1Score: true,
        player2Score: true,
    },
      relations: {
        player1: true,
        player2: true,
    },
      where: [
        { player1: { id: id } },
        { player2: { id: id } },
      ]
    });
    
    matchHistory['opponent'] = matches[0].player1.id === id ? matches[0].player2.username : matches[0].player1.username;
    matchHistory['userScore'] = matches[0].player1.id === id ? matches[0].player1Score : matches[0].player2Score;
    matchHistory['opponentScore'] = matches[0].player1.id === id ? matches[0].player2Score : matches[0].player1Score;
    matchHistory['isWinner'] = matchHistory['userScore'] > matchHistory['opponentScore'] ? true : false;
  }
  
  async getUserProfile(id: string) {
    const { username, rating, status } = await this.findUser(id);

    let matchHistory = {
      'opponent': '',
      'userScore': null,
      'opponentScore': null,
      'isWinner': true,
    }
    
    await this.buildMatchHistory(matchHistory, id);

    const profile = {
      name: username,
      status: status,
      rating: rating,
      matchHistory: matchHistory,
    };

    return profile;
  }

  async intra42UserExists(external_id: number): Promise<boolean> {
    const existingUser = await this.userRepository.find({
      where: { external_id: external_id },
    });

    if (Object.keys(existingUser).length == 0) return false;
    return true;
  }

  validate(user: any) {
    this.intra42UserExists(user.external_id).then((userExists: boolean) => {
      if (userExists == false) this.create(user);
    });
  }

  create(userInfo: any): Promise<CreateUserDto> {
    const newUser: CreateUserDto = this.userRepository.create({
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
