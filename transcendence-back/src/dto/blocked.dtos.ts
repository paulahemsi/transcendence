import { IsNotEmpty, IsUUID } from 'class-validator';

export class BlockedDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class BlockedNameDto {
  @IsNotEmpty()
  name: string;
}
