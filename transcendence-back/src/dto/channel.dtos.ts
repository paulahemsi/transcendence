import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class ChannelDto {}

export class UpdateChannelDto {
	@IsOptional()
	@IsNotEmpty()
	@MinLength(3)
	name: string;
  
	@IsOptional()
	@MinLength(5)
	password: string;
  }
