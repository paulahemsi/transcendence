import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';


@Entity()
export class Message {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;
  
  @CreateDateColumn()
  createdDate: Date;
  
  @Column({
    nullable: false,
  })
  message: string;

  @ManyToOne(() => Channel, (channel) => channel.id, {
    nullable: false,
  })
  channel: Channel;
  
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  user: User;
}
