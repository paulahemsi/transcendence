import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/dto/users.dtos';
import { User } from 'src/entity';
import { MatchHistory } from 'src/entity';
import { Repository } from 'typeorm';

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
    @InjectRepository(MatchHistory) private readonly matchHistoryRepository: Repository<MatchHistory>,
  ) {}

  getUsers() {
    return this.userRepository.find();
  }

  findUser(id: string) {
    return this.userRepository.findOneBy({ id });
  }
/****/
  isPlayer1theWinner(match: MatchHistory) : boolean {
    return match.player1Score > match.player2Score;
  }
  
  isPlayer1(id: string, match: MatchHistory) : boolean {
    return match.player1.id === id;
  }
  
  setOpponentsName(isUserPlayer1: boolean, match: MatchHistory) : string {
    if (isUserPlayer1) {
      return match.player2.username;
    }
    return match.player1.username;
  }
  
  setUserScore(isUserPlayer1: boolean, match: MatchHistory) : number {
    if (isUserPlayer1) {
      return (match.player1Score);
    }
    return match.player2Score;
  }
  
  setOpponentScore(isUserPlayer1: boolean, match: MatchHistory) : number {
    if (isUserPlayer1) {
      return match.player2Score;
    }
    return match.player1Score;
  }
  
  isUserTheWinner(matchInfo: matchInfos) : boolean {
    return matchInfo.userScore > matchInfo.opponentScore;
  }
  
  async executeMatchHistoryQuery(id: string) : Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
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
  }
  
  async buildMatchHistory(id: string) {
    
    const matches: Awaited<Promise<MatchHistory[]>> = await this.executeMatchHistoryQuery(id);
    
    let matchHistory: Array<matchInfos> = [];
    
    matches.map( (match) => {
        let matchInfo : matchInfos = new matchInfos();
        let isUserPlayer1 : boolean = this.isPlayer1(id, match);

        matchInfo.opponent = this.setOpponentsName(isUserPlayer1, match);
        matchInfo.userScore = this.setUserScore(isUserPlayer1, match);
        matchInfo.opponentScore = this.setOpponentScore(isUserPlayer1, match);
        matchInfo.isWinner = this.isUserTheWinner(matchInfo);

        matchHistory.push(matchInfo);
      }
    )
    
    return matchHistory;
  }
  
  async getUserProfile(id: string) {

    const { username, rating, status } = await this.findUser(id);

    const profile = {
      name: username,
      status: status,
      rating: rating,
      matchHistory: await this.buildMatchHistory(id),
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
