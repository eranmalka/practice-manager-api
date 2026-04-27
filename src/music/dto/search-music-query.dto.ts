import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchMusicQueryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  artist?: string;
}
