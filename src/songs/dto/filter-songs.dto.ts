import { SongStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterSongsDto {
  @IsEnum(SongStatus)
  @IsOptional()
  status?: SongStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
