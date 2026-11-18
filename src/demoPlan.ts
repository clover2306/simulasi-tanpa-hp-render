import {interpolate} from 'remotion';

export const FPS = 30;
export const TOTAL_FRAMES = 5746; // 191.52s @ 30fps, exact boundary of s03_tahun12

export type BeatMeta = {
  id: string;
  label: string;
  t0: number;
  t1: number;
  from: number;
  durationInFrames: number;
};

export const BEATS: BeatMeta[] = [
  {id: 'B01', label: 'Cold Open & Map', t0: 0.0, t1: 12.8, from: 0, durationInFrames: 384},
  {id: 'B02', label: 'Showcase Kevin', t0: 12.8, t1: 22.44, from: 384, durationInFrames: 289},
  {id: 'B03', label: 'Showcase Mulyadi', t0: 22.44, t1: 32.38, from: 673, durationInFrames: 298},
  {id: 'B04', label: 'Kartu Taruhan', t0: 32.38, t1: 53.43, from: 971, durationInFrames: 632},
  {id: 'B05', label: 'M1 Gembok & Tuas', t0: 53.43, t1: 73.12, from: 1603, durationInFrames: 591},
  {id: 'B06', label: 'Aturan 1 Teknologi', t0: 73.12, t1: 84.14, from: 2194, durationInFrames: 330},
  {id: 'B07', label: 'Aturan 2 Rencana', t0: 84.14, t1: 97.1, from: 2524, durationInFrames: 389},
  {id: 'B08', label: 'Aturan 3 Belajar', t0: 97.1, t1: 110.0, from: 2913, durationInFrames: 387},
  {id: 'B09', label: 'Satu Pembeda & Tahun 1', t0: 110.0, t1: 131.86, from: 3300, durationInFrames: 656},
  {id: 'B10', label: 'M2 Lumbung Terkuras', t0: 131.86, t1: 140.66, from: 3956, durationInFrames: 264},
  {id: 'B11', label: 'Warga Bertanya', t0: 140.66, t1: 156.68, from: 4220, durationInFrames: 480},
  {id: 'B12', label: 'V1 Pompa Mogok', t0: 156.68, t1: 169.58, from: 4700, durationInFrames: 387},
  {id: 'B13', label: 'Kontras Tanjungsari', t0: 169.58, t1: 191.52, from: 5087, durationInFrames: 659},
];

/** Convert absolute video seconds (from transcript_words.json) to local beat frames. */
export const localF = (beatId: string, absSec: number): number => {
  const b = BEATS.find((x) => x.id === beatId);
  if (!b) throw new Error(`Unknown beat ${beatId}`);
  return Math.round((absSec - b.t0) * FPS);
};

// Score checkpoint animation:
// Baseline Year 0/1 = 20 vs 20; Year 2 checkpoint arrives at 177.58s ("Indeks kemakmuran tahun kedua: Sinarbaru 28, Tanjungsari 34")
const Y2_SCORE_START_F = Math.round(177.58 * FPS); // 5327
const Y2_SCORE_END_F = Math.round(182.5 * FPS); // 5475
const YEAR2_START_F = Math.round(153.5 * FPS); // 4605 ("Tahun kedua")

export const hudStateAt = (globalFrame: number) => {
  const year = globalFrame >= YEAR2_START_F ? 2 : 1;
  const p = interpolate(globalFrame, [Y2_SCORE_START_F, Y2_SCORE_END_F], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const s = Math.round(20 + (28 - 20) * p);
  const t = Math.round(20 + (34 - 20) * p);
  return {year, s, t};
};
