import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUser } from 'src/entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnnectedUsersService {
  constructor(
    @InjectRepository(ConnectedUser)
    private readonly connectedUserRepository: Repository<ConnectedUser>,
  ) {}
}
