import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { ChannelType } from './channel-type.entity';
import { Message } from './message.entity';


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

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  //?Faz sentido type ser uma tabela a parte? pq não é um define?
  type: ChannelType;
  
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  owner: User;

  @Column({
    nullable: true,
  })
  //*Nota: aqui lembrar de passar pelo algoritmo de hash 
  password: string;

  @OneToMany(() => Message, (message) => message.id)
  messages: Message[];
}
