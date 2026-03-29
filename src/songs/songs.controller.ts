import { Controller, Get } from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  getAllSongs() {
    return this.songsService.getSongs();
  }

  @Get(':id')
  getSongById() {
    return { id: 1, name: 'Little Wing' };
  }
}
