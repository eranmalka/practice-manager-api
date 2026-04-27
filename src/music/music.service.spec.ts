import { HttpException } from '@nestjs/common';
import { MusicService } from './music.service';

describe('MusicService', () => {
  const originalFetch = global.fetch;
  const service = new MusicService();

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns mapped matches on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          recordings: [
            {
              id: 'rec-1',
              title: 'Human Nature',
              'artist-credit': [{ name: 'Michael Jackson' }],
              'first-release-date': '1982-11-30',
            },
          ],
        }),
    });

    const res = await service.search({ title: 'Human Nature' });
    expect(res.matches).toHaveLength(1);
    expect(res.matches[0]).toEqual({
      id: 'rec-1',
      title: 'Human Nature',
      artist: 'Michael Jackson',
      releaseYear: 1982,
      sheetMusicUrl: null,
    });
  });

  it('throws BadGateway when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network'));
    await expect(service.search({ title: 'X', artist: 'Y' })).rejects.toThrow(
      HttpException,
    );
  });
});
