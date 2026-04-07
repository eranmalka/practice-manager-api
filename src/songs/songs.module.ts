import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SongsController],
  imports: [PrismaModule],
  providers: [SongsService],
})
export class SongsModule {}
