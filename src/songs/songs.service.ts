import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.song.findMany();
  }

  create(data: { name: string; artist: string }) {
    return this.prisma.song.create({
      data,
    });
  }
}
