import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { ChannelType } from './channel-type.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @ManyToOne(() => ChannelType, (type) => type.id, {
    nullable: false,
  })
  type: ChannelType;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner: User;

  @Column({
    nullable: true,
  })
  password: string;
}
