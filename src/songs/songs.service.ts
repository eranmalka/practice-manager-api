import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
  getSongs() {
    return [
      { id: 1, name: 'Little Wing', artist: 'Jimi Hendrix' },
      { id: 2, name: 'Under the Bridge', artist: 'RHCP' },
    ];
  }
}
