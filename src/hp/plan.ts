import {Easing, interpolate} from 'remotion';

export const FPS = 30;
export const HP_TOTAL_FRAMES = 21350; // 711.68s @ 30fps

export interface HpBeatMeta {
  id: string;
  nama: string;
  t0: number;
  t1: number;
  f0: number;
  f1: number;
  durationInFrames: number;
}

const RAW_WINDOWS: Array<{beat: string; nama: string; t0: number; t1: number; f0: number; f1: number}> = [
  {beat: 'B01', nama: 'B1 premis', t0: 0.0, t1: 22.62, f0: 0, f1: 679},
  {beat: 'B02', nama: 'B2 pertanyaan', t0: 22.62, t1: 33.74, f0: 679, f1: 1012},
  {beat: 'B03', nama: 'B3 dimensi', t0: 33.74, t1: 40.32, f0: 1012, f1: 1210},
  {beat: 'B04', nama: 'B4 intro+tebak', t0: 40.32, t1: 50.16, f0: 1210, f1: 1505},
  {beat: 'B05', nama: 'B4a Dika', t0: 50.16, t1: 66.42, f0: 1505, f1: 1993},
  {beat: 'B06', nama: 'B4b Endang', t0: 66.42, t1: 78.58, f0: 1993, f1: 2357},
  {beat: 'B07', nama: 'B4c Harjo', t0: 78.58, t1: 88.3, f0: 2357, f1: 2649},
  {beat: 'B08', nama: 'B4d Tia', t0: 88.3, t1: 100.7, f0: 2649, f1: 3021},
  {beat: 'B09', nama: 'B4e Omen', t0: 100.7, t1: 117.56, f0: 3021, f1: 3527},
  {beat: 'B10', nama: 'B5 simpan+mulai', t0: 117.56, t1: 126.82, f0: 3527, f1: 3805},
  {beat: 'B11', nama: 'B6 tahun 1-2', t0: 126.82, t1: 158.76, f0: 3805, f1: 4763},
  {beat: 'B12', nama: 'A1 checkpoint Y2', t0: 158.76, t1: 168.16, f0: 4763, f1: 5045},
  {beat: 'B13', nama: 'B7 Dika', t0: 168.16, t1: 180.1, f0: 5045, f1: 5403},
  {beat: 'B14', nama: 'B7 kartu Beland', t0: 180.1, t1: 201.86, f0: 5403, f1: 6056},
  {beat: 'B15', nama: 'B8 Endang', t0: 201.86, t1: 214.68, f0: 6056, f1: 6440},
  {beat: 'B16', nama: 'B8 kartu Jensen', t0: 214.68, t1: 236.2, f0: 6440, f1: 7086},
  {beat: 'B17', nama: 'A1 checkpoint Y4', t0: 236.2, t1: 245.18, f0: 7086, f1: 7355},
  {beat: 'B18', nama: 'B9 ultah Tia', t0: 245.18, t1: 266.04, f0: 7355, f1: 7981},
  {beat: 'B19', nama: 'B10 Harjo makan', t0: 266.04, t1: 281.5, f0: 7981, f1: 8445},
  {beat: 'B20', nama: 'B11 Omen', t0: 281.5, t1: 294.38, f0: 8445, f1: 8831},
  {beat: 'B21', nama: 'A1 checkpoint Y6', t0: 294.38, t1: 306.3, f0: 8831, f1: 9189},
  {beat: 'B22', nama: 'A2 dialog1 Kertajaya', t0: 306.3, t1: 318.3, f0: 9189, f1: 9549},
  {beat: 'B23', nama: 'A2 dialog1 Mekarsari', t0: 318.3, t1: 324.6, f0: 9549, f1: 9738},
  {beat: 'B24', nama: 'A1 checkpoint Y10', t0: 324.6, t1: 331.5, f0: 9738, f1: 9945},
  {beat: 'B25', nama: 'B12 tebakan', t0: 331.5, t1: 343.16, f0: 9945, f1: 10295},
  {beat: 'B26', nama: 'A5 gelombang penipuan', t0: 343.16, t1: 356.74, f0: 10295, f1: 10702},
  {beat: 'B27', nama: 'B13 Omen Mekarsari', t0: 356.74, t1: 377.06, f0: 10702, f1: 11312},
  {beat: 'B28', nama: 'B13 Omen Kertajaya', t0: 377.06, t1: 386.16, f0: 11312, f1: 11585},
  {beat: 'B29', nama: 'A1 checkpoint Y12', t0: 386.16, t1: 394.64, f0: 11585, f1: 11839},
  {beat: 'B30', nama: 'A3 dialog2', t0: 394.64, t1: 411.48, f0: 11839, f1: 12344},
  {beat: 'B31', nama: 'B14 Dika guru', t0: 411.48, t1: 423.12, f0: 12344, f1: 12694},
  {beat: 'B32', nama: 'B14 Dika Mekarsari', t0: 423.12, t1: 432.62, f0: 12694, f1: 12979},
  {beat: 'B33', nama: 'A1 checkpoint Y14', t0: 432.62, t1: 436.62, f0: 12979, f1: 13099},
  {beat: 'B34', nama: 'B15 Tia berhenti', t0: 436.62, t1: 459.66, f0: 13099, f1: 13790},
  {beat: 'B35', nama: 'B15 kartu Allcott', t0: 459.66, t1: 482.28, f0: 13790, f1: 14468},
  {beat: 'B36', nama: 'B16 Endang menang', t0: 482.28, t1: 493.96, f0: 14468, f1: 14819},
  {beat: 'B37', nama: 'A1 checkpoint Y17', t0: 493.96, t1: 499.16, f0: 14819, f1: 14975},
  {beat: 'B38', nama: 'A4 dialog3 dua malam', t0: 499.16, t1: 524.26, f0: 14975, f1: 15728},
  {beat: 'B39', nama: 'A1 Y20 + A8a intro', t0: 524.26, t1: 533.98, f0: 15728, f1: 16019},
  {beat: 'B40', nama: 'Verdict Dika', t0: 533.98, t1: 541.9, f0: 16019, f1: 16257},
  {beat: 'B41', nama: 'Verdict Endang', t0: 541.9, t1: 550.7, f0: 16257, f1: 16521},
  {beat: 'B42', nama: 'Verdict Harjo', t0: 550.7, t1: 556.12, f0: 16521, f1: 16684},
  {beat: 'B43', nama: 'Verdict Tia', t0: 556.12, t1: 562.56, f0: 16684, f1: 16877},
  {beat: 'B44', nama: 'Verdict Omen', t0: 562.56, t1: 578.64, f0: 16877, f1: 17359},
  {beat: 'B45', nama: 'A6 rerun', t0: 578.64, t1: 597.8, f0: 17359, f1: 17934},
  {beat: 'B46', nama: 'A7 seratus kali', t0: 597.8, t1: 620.84, f0: 17934, f1: 18625},
  {beat: 'B47', nama: 'A7 dekomposisi', t0: 620.84, t1: 628.24, f0: 18625, f1: 18847},
  {beat: 'B48', nama: 'A8b jawaban', t0: 628.24, t1: 649.64, f0: 18847, f1: 19489},
  {beat: 'B49', nama: 'A8b musuh+dunia kita', t0: 649.64, t1: 673.84, f0: 19489, f1: 20215},
  {beat: 'B50', nama: 'B17 CTA', t0: 673.84, t1: 688.06, f0: 20215, f1: 20642},
  {beat: 'B51', nama: 'A9 penutup', t0: 688.06, t1: 707.9, f0: 20642, f1: 21237},
  {beat: 'B52', nama: 'A9 kalimat akhir', t0: 707.9, t1: 711.68, f0: 21237, f1: 21350},
];

export const HP_BEATS: HpBeatMeta[] = RAW_WINDOWS.map((w) => ({
  id: w.beat,
  nama: w.nama,
  t0: w.t0,
  t1: w.t1,
  f0: w.f0,
  f1: w.f1,
  durationInFrames: w.f1 - w.f0,
}));

export const beatDur = (beatId: string): number => {
  const b = HP_BEATS.find((x) => x.id === beatId);
  if (!b) throw new Error(`Unknown beat ${beatId}`);
  return b.durationInFrames;
};

export const hpLocalF = (beatId: string, absSec: number): number => {
  const b = HP_BEATS.find((x) => x.id === beatId);
  if (!b) throw new Error(`Unknown beat ${beatId}`);
  return Math.round(absSec * FPS) - b.f0;
};

/** Continuous easeInOutCubic interpolation in [0, 1] (zero quantization, zero pixel snapping). */
export const smooth01 = (f: number, fStart: number, fEnd: number): number => {
  if (f <= fStart) return 0;
  if (f >= fEnd) return 1;
  return interpolate(f, [fStart, fEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
};

export interface HeldCheckpointScore {
  checkpointYear: number;
  k: number;
  m: number;
  crackedM?: boolean;
}

export interface HpHudState {
  yearLabel: string | null;
  heldScore: HeldCheckpointScore | null;
  sealedQuestion: boolean;
  kertajayaRerunHp: boolean;
  hudOpacity: number;
}

export const hpHudStateAt = (gf: number): HpHudState => {
  if (gf >= 21020) {
    const op = gf >= 21160 ? 0 : 1 - smooth01(gf, 21020, 21160);
    return {
      yearLabel: 'TAHUN 20 • MALAM TERAKHIR',
      heldScore: null,
      sealedQuestion: false,
      kertajayaRerunHp: false,
      hudOpacity: op,
    };
  }

  const sealedQuestion = gf >= 3645 && gf < 18865;
  const kertajayaRerunHp = gf >= 17614 && gf < 17934;

  let heldScore: HeldCheckpointScore | null = null;
  if (gf >= 5045 && gf < 7086) {
    heldScore = {checkpointYear: 2, k: 44, m: 47};
  } else if (gf >= 7355 && gf < 8831) {
    heldScore = {checkpointYear: 4, k: 52, m: 54};
  } else if (gf >= 9189 && gf < 9738) {
    heldScore = {checkpointYear: 6, k: 59, m: 58};
  } else if (gf >= 9945 && gf < 11585) {
    heldScore = {checkpointYear: 10, k: 66, m: 62};
  } else if (gf >= 11839 && gf < 12979) {
    heldScore = {checkpointYear: 12, k: 71, m: 64, crackedM: true};
  } else if (gf >= 13099 && gf < 14819) {
    heldScore = {checkpointYear: 14, k: 76, m: 67};
  } else if (gf >= 14975 && gf < 15728) {
    heldScore = {checkpointYear: 17, k: 80, m: 69};
  } else if (gf >= 16019 && gf < 17359) {
    heldScore = {checkpointYear: 20, k: 86, m: 72};
  }

  let yearLabel: string | null = null;
  if (gf < 1012) {
    yearLabel = null;
  } else if (gf < 1210) {
    yearLabel = 'TAHUN 0 — 20';
  } else if (gf < 3527) {
    yearLabel = 'LIMA WARGA';
  } else if (gf < 3734) {
    yearLabel = 'PERSIAPAN';
  } else if (gf < 4280) {
    yearLabel = 'TAHUN 1';
  } else if (gf < 5045) {
    yearLabel = 'TAHUN 2';
  } else if (gf < 6056) {
    yearLabel = 'TAHUN 3';
  } else if (gf < 7355) {
    yearLabel = 'TAHUN 4';
  } else if (gf < 8445) {
    yearLabel = 'TAHUN 5';
  } else if (gf < 9189) {
    yearLabel = 'TAHUN 6';
  } else if (gf < 9738) {
    yearLabel = 'TAHUN 7–8';
  } else if (gf < 9945) {
    yearLabel = 'TAHUN 10';
  } else if (gf < 10295) {
    yearLabel = 'TAHUN 10 ?';
  } else if (gf < 10702) {
    yearLabel = 'TAHUN 11';
  } else if (gf < 12344) {
    yearLabel = 'TAHUN 12';
  } else if (gf < 12979) {
    yearLabel = 'TAHUN 13–14';
  } else if (gf < 13099) {
    yearLabel = 'TAHUN 14';
  } else if (gf < 14468) {
    yearLabel = 'TAHUN 15–16';
  } else if (gf < 14975) {
    yearLabel = 'TAHUN 17';
  } else if (gf < 15728) {
    yearLabel = 'TAHUN 18';
  } else if (gf < 17359) {
    yearLabel = 'TAHUN 20';
  } else if (gf < 17934) {
    const lf = gf - 17359;
    if (lf < 85) {
      const yr = Math.max(1, Math.round(20 - (lf / 85) * 19));
      yearLabel = `<< ULANG • THN ${yr}`;
    } else if (lf < 175) {
      yearLabel = 'ATURAN ULANG';
    } else if (lf < 255) {
      const yr = Math.min(10, Math.max(1, Math.round(1 + ((lf - 175) / 80) * 9)));
      yearLabel = `RERUN • TAHUN ${yr}`;
    } else if (lf < 370) {
      const yr = Math.min(20, Math.max(11, Math.round(11 + ((lf - 255) / 115) * 9)));
      yearLabel = `RERUN • TAHUN ${yr}`;
    } else {
      yearLabel = 'HASIL RERUN • THN 20';
    }
  } else if (gf < 18847) {
    yearLabel = 'UJI 100 KALI';
  } else if (gf < 20215) {
    yearLabel = 'JAWABAN INTI';
  } else if (gf < 20642) {
    yearLabel = 'PILIHANMU';
  } else {
    yearLabel = 'TAHUN 20 • MALAM TERAKHIR';
  }

  return {
    yearLabel,
    heldScore,
    sealedQuestion,
    kertajayaRerunHp,
    hudOpacity: 1,
  };
};
