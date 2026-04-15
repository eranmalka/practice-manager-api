import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';

@Controller('songs')
@UseGuards(AuthGuard('jwt'))
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  findAll(@Req() req: Request & { user: { id: number } }) {
    return this.songsService.findAllByUser(req.user.id);
  }

  @Post()
  create(
    @Req() req: Request & { user: { id: number } },
    @Body() dto: CreateSongDto,
  ) {
    return this.songsService.create(dto, req.user.id);
  }

  @Get(':id')
  findOne(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.songsService.findOne(id, req.user.id);
  }
}
