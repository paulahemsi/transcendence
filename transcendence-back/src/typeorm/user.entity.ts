import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    nullable: false,
    default: 'Player',
  })
  username: string;

  @Column({
    nullable: false,
    default: 'Player',
  })
  password: string;

  @Column({
    nullable: false,
    default: 0,
  })
  rating: number;
}
