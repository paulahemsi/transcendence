import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUser, User } from 'src/entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnnectedUsersService {
  constructor(
    @InjectRepository(ConnectedUser)
    private readonly connectedUserRepository: Repository<ConnectedUser>,
  ) {}

  create(client: string, user: User) {
    const connectedUser = { client, user };
    return this.connectedUserRepository.save(connectedUser);
  }

  delete(client: string) {
    return this.connectedUserRepository.delete({ client });
  }

  deleteAll() {
    this.connectedUserRepository.clear();
  }

  async hasConnections(user: User) {
    const userSession = await this.connectedUserRepository.findOneBy({
      user: { id: user.id },
    });
    if (userSession) {
      return true;
    }
    return false;
  }
}
