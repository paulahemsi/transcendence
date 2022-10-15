import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class ChatMessagelDto {
  @IsNotEmpty()
  @IsNumber()
  channel: number;

  @IsNotEmpty()
  @IsUUID()
  user: string;

  @IsNotEmpty()
  message: string;
}
