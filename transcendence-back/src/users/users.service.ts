import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/users.dtos';
import { User } from 'src/entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getUsers() {
    return this.userRepository.find();
  }

  findUser(id: string) {
    return this.userRepository.find({
      where: { id: id },
    });
  }
  
  async getUserProfile(id: string) {
    
    const {username, rating} = await this.userRepository.findOne({
      where: { id: id },
    })
    const profile = {
      "name": username,
      "status": "online",
      "rating": rating,
    }
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
}
