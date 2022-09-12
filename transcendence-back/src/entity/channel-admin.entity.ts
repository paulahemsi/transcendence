import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
export class ChannelAdmin {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => Channel, (channel) => channel.id, {
    nullable: false,
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  user: User;
}
