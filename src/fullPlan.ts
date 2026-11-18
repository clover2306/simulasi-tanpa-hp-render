import {FPS, HP_BEATS, HP_TOTAL_FRAMES} from './hp/plan';

export {FPS};
export const FULL_TOTAL_FRAMES = HP_TOTAL_FRAMES; // 21350 frames (711.68s @ 30fps)
export const FULL_BEATS = HP_BEATS;

export const fullLocalF = (beatId: string, absSec: number): number => {
  const b = HP_BEATS.find((x) => x.id === beatId);
  if (!b) throw new Error(`Unknown beat ${beatId}`);
  return Math.round((absSec - b.t0) * FPS);
};

// Kept only for legacy scene type compatibility in old Demo/unused files
export const fullHudStateAt = (_globalFrame: number) => {
  void _globalFrame;
  return {year: 1, s: 0, t: 0};
};
