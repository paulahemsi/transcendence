import {
  IsNotEmpty,
  MinLength,
  IsPositive,
  IsEmail,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  external_id: number;

  @IsUrl()
  image_url: string;

  @IsNotEmpty()
  @IsPositive()
  rating: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsOptional()
  @IsUrl()
  image_url: string;
}
