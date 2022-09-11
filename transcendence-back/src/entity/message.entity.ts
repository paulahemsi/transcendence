import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';


@Entity()
export class Message {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
  })
  message: string;

  @OneToOne(() => Channel)
  channel: Channel;
  
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  user: User;
}
