import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @IsOptional()
  password?: string;
}
