-- Repertoire / Song: UUID id, new enums, chord chart + MusicBrainz fields
DROP TABLE IF EXISTS "Song" CASCADE;

CREATE TYPE "SongStatus" AS ENUM (
  'want_to_learn',
  'learning',
  'in_rotation',
  'performance_ready'
);

CREATE TYPE "ChordChartFormat" AS ENUM (
  'chordpro',
  'ireal',
  'plain'
);

CREATE TABLE "Song" (
  "id" TEXT NOT NULL,
  "userId" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "artist" TEXT,
  "status" "SongStatus" NOT NULL DEFAULT 'want_to_learn',
  "backingTrackUrl" TEXT,
  "musicBrainzRecordingId" TEXT,
  "sheetMusicUrl" TEXT,
  "chordChartRaw" TEXT,
  "chordChartFormat" "ChordChartFormat",
  "chordChartKey" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Song_userId_idx" ON "Song"("userId");

ALTER TABLE "Song" ADD CONSTRAINT "Song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
