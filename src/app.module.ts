import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MusicModule } from './music/music.module';

@Module({
  imports: [SongsModule, PrismaModule, UsersModule, AuthModule, MusicModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
