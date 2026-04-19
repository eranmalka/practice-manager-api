import { IsOptional, IsString } from 'class-validator';

export class FilterSongsDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
