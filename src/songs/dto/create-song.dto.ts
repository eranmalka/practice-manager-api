import { ChordChartFormat, SongStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CHROMATIC_KEYS } from '../chromatic-keys';
import { trimIfString } from './transform-utils';

/** 2MB cap for paste tabs / ChordPro text */
const CHORD_CHART_MAX = 2 * 1024 * 1024;

export class CreateSongDto {
  @Transform(trimIfString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  artist?: string | null;

  @IsEnum(SongStatus)
  status: SongStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  musicBrainzRecordingId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  sheetMusicUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  backingTrackUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(CHORD_CHART_MAX)
  chordChartRaw?: string | null;

  @IsOptional()
  @IsEnum(ChordChartFormat)
  chordChartFormat?: ChordChartFormat | null;

  @IsOptional()
  @IsIn([...CHROMATIC_KEYS] as string[])
  chordChartKey?: string | null;
}
