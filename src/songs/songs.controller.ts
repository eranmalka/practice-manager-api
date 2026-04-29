import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { CreateSongDto } from './dto/create-song.dto';
import { FilterSongsDto } from './dto/filter-songs.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';

@Controller('repertoire/songs')
@UseGuards(AuthGuard('jwt'))
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  findAll(
    @Req() req: Request & { user: { id: number } },
    @Query() filters: FilterSongsDto,
  ) {
    return this.songsService.findAllByUser(req.user.id, filters);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request & { user: { id: number } },
    @Body() dto: CreateSongDto,
  ) {
    return this.songsService.create(dto, req.user.id);
  }

  @Get(':id')
  findOne(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.songsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSongDto,
  ) {
    return this.songsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Req() req: Request & { user: { id: number } },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.songsService.remove(id, req.user.id);
  }
}
