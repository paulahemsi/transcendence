import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => User, (user) => user.id)
  friend: User;

  @ManyToOne(() => Channel, (channel) => channel.id)
  channel: Channel;
}
