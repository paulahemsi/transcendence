import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddFriendDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
