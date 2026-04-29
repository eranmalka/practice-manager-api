/** 12 equal-temperament keys (sharps), aligned with the Angular front. */
export const CHROMATIC_KEYS = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export type ChromaticKey = (typeof CHROMATIC_KEYS)[number];
