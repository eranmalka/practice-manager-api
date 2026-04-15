import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSongDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  artist?: string;

  @IsString()
  @IsOptional()
  composer?: string;

  @IsString()
  @IsOptional()
  key?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  bpm?: number;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  difficulty?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  lyrics?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
