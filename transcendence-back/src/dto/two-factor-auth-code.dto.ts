import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TwoFactorAuthCodeDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  @IsNumberString()
  code: string;
}
