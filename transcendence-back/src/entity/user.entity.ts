import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateUserDto } from 'src/dto/users.dtos';

export enum status {
  ONLINE = 'online',
  OFFLINE = 'offline',
  IN_GAME = 'in_game',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: 'Player',
  })
  username: string;

  @Column({
    nullable: true,
    default: '',
  })
  email: string;

  @Column({
    nullable: false,
  })
  external_id: number;

  @Column({
    nullable: true,
    default: '',
  })
  image_url: string;

  @Column({
    nullable: false,
    default: 0,
  })
  rating: number;

  @Column({
    nullable: false,
    default: status.OFFLINE,
  })
  status: status;

  @Column({
    nullable: true,
  })
  secret: string;

  @Column({
    default: false,
    nullable: false,
  })
  hasTwoFactorAuth: boolean;

  private updateUsername(username: string) {
    this.username = username;
  }

  private updateImage(image: string) {
    this.image_url = image;
  }

  update(userDto: UpdateUserDto) {
    if (userDto.username) {
      this.updateUsername(userDto.username);
    }
    if (userDto.image_url) {
      this.updateImage(userDto.image_url);
    }
  }
}
