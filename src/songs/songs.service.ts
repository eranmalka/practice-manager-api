import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUser(userId: number) {
    return this.prisma.song.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const song = await this.prisma.song.findFirst({
      where: { id, userId },
    });
    if (!song) {
      throw new NotFoundException(`Song #${id} not found`);
    }
    return song;
  }

  create(dto: CreateSongDto, userId: number) {
    return this.prisma.song.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async update(id: number, dto: UpdateSongDto, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.song.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.song.delete({
      where: { id },
    });
  }
}
