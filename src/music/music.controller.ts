import { Controller, Get, Query } from '@nestjs/common';
import { MusicService } from './music.service';
import { SearchMusicQueryDto } from './dto/search-music-query.dto';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  /** Public search. Optional JWT in headers is accepted by the client but not required. */
  @Get('search')
  search(@Query() query: SearchMusicQueryDto) {
    return this.musicService.search(query);
  }
}
