import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MatchHistory {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  player1: User;

  @ManyToOne(() => User, (user) => user.id)
  player2: User;

  @Column({
    nullable: true,
  })
  player1Score: number;

  @Column({
    nullable: true,
  })
  player2Score: number;

  @Column({
    nullable: false,
  })
  date: string;
}
