import { IsNotEmpty, IsOptional, IsUUID, MinLength } from "class-validator";

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

export class MessagelDto {
	@IsNotEmpty()
	message: string;
  
	@IsNotEmpty()
	@IsUUID()
	user: string;
  }
