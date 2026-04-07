import { Controller, Get, Post, Body } from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Get()
  getAll() {
    return this.songsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; artist: string }) {
    return this.songsService.create(body);
  }
}
