import { IsNotEmpty, MinLength, IsPositive } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsPositive()
  rating: number;
}
