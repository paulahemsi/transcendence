import { IsNotEmpty, IsOptional, IsUUID, MinLength } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @IsUUID()
  owner: string;

  @IsOptional()
  @MinLength(5)
  password: string;
}

export class UpdateChannelDto {
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsOptional()
  @MinLength(5)
  password: string;
}

export class MessagelDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsUUID()
  user: string;
}
