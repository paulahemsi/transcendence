import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
