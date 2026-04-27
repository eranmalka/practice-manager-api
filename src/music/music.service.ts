import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SearchMusicQueryDto } from './dto/search-music-query.dto';

const MUSICBRAINZ_USER_AGENT =
  process.env.MUSICBRAINZ_USER_AGENT ??
  'PracticeManager/0.1 ( https://github.com/eranmalka/practice-manager-api )';

const MAX_MATCHES = 8;
const MUSICBRAINZ_SEARCH_URL = 'https://musicbrainz.org/ws/2/recording';

type MbRecording = {
  id?: string;
  title?: string;
  'artist-credit'?: Array<{ name?: string }>;
  releases?: Array<{ date?: string }>;
  'first-release-date'?: string;
};

type MbSearchResponse = {
  recordings?: MbRecording[];
};

function escapeLucenePhrase(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildQuery(dto: SearchMusicQueryDto): string {
  const titleQ = `recording:"${escapeLucenePhrase(dto.title.trim())}"`;
  if (dto.artist?.trim()) {
    return `${titleQ} AND artist:"${escapeLucenePhrase(dto.artist.trim())}"`;
  }
  return titleQ;
}

function parseYearFromDate(dateStr: string | undefined): number | null {
  if (!dateStr) {
    return null;
  }
  const year = parseInt(dateStr.slice(0, 4), 10);
  return Number.isFinite(year) ? year : null;
}

function artistFromRecording(r: MbRecording): string {
  const credits = r['artist-credit'];
  if (!credits?.length) {
    return '';
  }
  return (
    credits
      .map((c) => c.name)
      .filter(Boolean)
      .join(' / ') || ''
  );
}

function yearFromRecording(r: MbRecording): number | null {
  const first = parseYearFromDate(r['first-release-date']);
  if (first !== null) {
    return first;
  }
  const rel = r.releases?.[0]?.date;
  return parseYearFromDate(rel);
}

@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name);

  async search(dto: SearchMusicQueryDto) {
    const query = buildQuery(dto);
    const url = new URL(MUSICBRAINZ_SEARCH_URL);
    url.searchParams.set('query', query);
    url.searchParams.set('fmt', 'json');
    url.searchParams.set('limit', String(MAX_MATCHES));

    let res: Response;
    try {
      res = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
          'User-Agent': MUSICBRAINZ_USER_AGENT,
        },
      });
    } catch (e) {
      this.logger.error('MusicBrainz request failed', e);
      throw new HttpException(
        'Music search service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (!res.ok) {
      this.logger.warn(`MusicBrainz HTTP ${res.status}`);
      throw new HttpException(
        'Music search service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }

    let data: MbSearchResponse;
    try {
      data = (await res.json()) as MbSearchResponse;
    } catch (e) {
      this.logger.error('MusicBrainz JSON parse failed', e);
      throw new HttpException(
        'Music search service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const recordings = (data.recordings ?? [])
      .filter((r) => r.id)
      .slice(0, MAX_MATCHES);
    const matches = recordings.map((r) => {
      const year = yearFromRecording(r);
      return {
        id: r.id as string,
        title: r.title ?? '',
        artist: artistFromRecording(r),
        releaseYear: year,
        sheetMusicUrl: null as const,
      };
    });

    return { matches };
  }
}
