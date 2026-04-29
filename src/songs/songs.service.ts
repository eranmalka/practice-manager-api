import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';
import { FilterSongsDto } from './dto/filter-songs.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUser(userId: number, filters: FilterSongsDto) {
    return this.prisma.song.findMany({
      where: {
        userId,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { artist: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: number) {
    const song = await this.prisma.song.findFirst({
      where: { id, userId },
    });
    if (!song) {
      throw new NotFoundException(`Song not found`);
    }
    return song;
  }

  create(dto: CreateSongDto, userId: number) {
    return this.prisma.song.create({
      data: {
        userId,
        title: dto.title,
        artist: dto.artist ?? null,
        status: dto.status,
        musicBrainzRecordingId: dto.musicBrainzRecordingId ?? null,
        sheetMusicUrl: dto.sheetMusicUrl ?? null,
        backingTrackUrl: dto.backingTrackUrl ?? null,
        chordChartRaw: dto.chordChartRaw ?? null,
        chordChartFormat: dto.chordChartFormat ?? null,
        chordChartKey: dto.chordChartKey === undefined ? 'C' : dto.chordChartKey,
      },
    });
  }

  async update(id: string, dto: UpdateSongDto, userId: number) {
    await this.findOne(id, userId);
    const data: Prisma.SongUpdateInput = {};
    if (dto.title !== undefined) {
      data.title = dto.title;
    }
    if (dto.artist !== undefined) {
      data.artist = dto.artist;
    }
    if (dto.status !== undefined) {
      data.status = dto.status;
    }
    if (dto.musicBrainzRecordingId !== undefined) {
      data.musicBrainzRecordingId = dto.musicBrainzRecordingId;
    }
    if (dto.sheetMusicUrl !== undefined) {
      data.sheetMusicUrl = dto.sheetMusicUrl;
    }
    if (dto.backingTrackUrl !== undefined) {
      data.backingTrackUrl = dto.backingTrackUrl;
    }
    if (dto.chordChartRaw !== undefined) {
      data.chordChartRaw = dto.chordChartRaw;
    }
    if (dto.chordChartFormat !== undefined) {
      data.chordChartFormat = dto.chordChartFormat;
    }
    if (dto.chordChartKey !== undefined) {
      data.chordChartKey = dto.chordChartKey;
    }
    if (Object.keys(data).length === 0) {
      return this.findOne(id, userId);
    }
    return this.prisma.song.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: number) {
    await this.findOne(id, userId);
    await this.prisma.song.delete({
      where: { id },
    });
  }
}
