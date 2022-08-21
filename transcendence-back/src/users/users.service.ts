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

  findUsersById(id: number) {
    return this.userRepository.find({
      where: { id: id },
    });
  }
}
