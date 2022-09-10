import { IsNotEmpty, IsUUID } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
