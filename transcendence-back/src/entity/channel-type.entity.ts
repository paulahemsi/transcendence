import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum channelType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
  DIRECT_MESSAGES = 'DIRECT_MESSAGES',
}

@Entity()
export class ChannelType {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: channelType,
  })
  type: channelType;
}
