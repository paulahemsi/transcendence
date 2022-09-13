import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChannelType {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
  })
  type: string;
}
