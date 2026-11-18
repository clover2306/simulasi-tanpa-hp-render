import React from 'react';
import {AbsoluteFill} from 'remotion';
import './pixelFont';
import {PX} from './components/PixelUI';
import {HP_BEATS} from './hp/plan';
import {HpGlobalHud} from './hp/hud';
import {PixelWipeSeries, type HpCutScene} from './hp/transition';
import {
  B01_Premis,
  B02_Pertanyaan,
  B03_Dimensi,
  B04_IntroTebak,
  B05_Dika,
  B06_Endang,
  B07_Harjo,
  B08_Tia,
  B09_Omen,
  B10_SimpanMulai,
} from './hp/beats/Act1_Opening';
import {
  B11_Tahun12,
  B12_CheckpointY2,
  B13_DikaY3,
  B14_KartuBeland,
  B15_EndangY3,
  B16_KartuJensen,
  B17_CheckpointY4,
  B18_UltahTia,
  B19_HarjoMakanMontase,
  B20_OmenY5,
  B21_CheckpointY6,
} from './hp/beats/Act2_EarlyYears';
import {
  B22_Dialog1Kertajaya,
  B23_Dialog1Mekarsari,
  B24_CheckpointY10,
  B25_Tebakan,
  B26_ScamWave,
  B27_OmenMekarsari,
  B28_OmenKertajaya,
  B29_CheckpointY12,
  B30_Dialog2Omen,
  B31_DikaGuru,
  B32_DikaMekarsari,
  B33_CheckpointY14,
} from './hp/beats/Act3_MidTwist';
import {
  B34_TiaBerhenti,
  B35_KartuAllcott,
  B36_EndangMenang,
  B37_CheckpointY17,
  B38_Dialog3DuaMalam,
  B39_Y20Intro,
  B40_VerdictDika,
  B41_VerdictEndang,
  B42_VerdictHarjo,
  B43_VerdictTia,
  B44_VerdictOmen,
} from './hp/beats/Act4_LateAndVerdicts';
import {
  B45_Rerun,
  B46_SeratusKali,
  B47_Dekomposisi,
  B48_JawabanInti,
  B49_MusuhDuniaKita,
  B50_CTA,
  B51_Penutup,
  B52_KalimatAkhir,
} from './hp/beats/Act5_Ending';

const COMP_BY_ID: Record<string, React.ComponentType> = {
  B01: B01_Premis,
  B02: B02_Pertanyaan,
  B03: B03_Dimensi,
  B04: B04_IntroTebak,
  B05: B05_Dika,
  B06: B06_Endang,
  B07: B07_Harjo,
  B08: B08_Tia,
  B09: B09_Omen,
  B10: B10_SimpanMulai,
  B11: B11_Tahun12,
  B12: B12_CheckpointY2,
  B13: B13_DikaY3,
  B14: B14_KartuBeland,
  B15: B15_EndangY3,
  B16: B16_KartuJensen,
  B17: B17_CheckpointY4,
  B18: B18_UltahTia,
  B19: B19_HarjoMakanMontase,
  B20: B20_OmenY5,
  B21: B21_CheckpointY6,
  B22: B22_Dialog1Kertajaya,
  B23: B23_Dialog1Mekarsari,
  B24: B24_CheckpointY10,
  B25: B25_Tebakan,
  B26: B26_ScamWave,
  B27: B27_OmenMekarsari,
  B28: B28_OmenKertajaya,
  B29: B29_CheckpointY12,
  B30: B30_Dialog2Omen,
  B31: B31_DikaGuru,
  B32: B32_DikaMekarsari,
  B33: B33_CheckpointY14,
  B34: B34_TiaBerhenti,
  B35: B35_KartuAllcott,
  B36: B36_EndangMenang,
  B37: B37_CheckpointY17,
  B38: B38_Dialog3DuaMalam,
  B39: B39_Y20Intro,
  B40: B40_VerdictDika,
  B41: B41_VerdictEndang,
  B42: B42_VerdictHarjo,
  B43: B43_VerdictTia,
  B44: B44_VerdictOmen,
  B45: B45_Rerun,
  B46: B46_SeratusKali,
  B47: B47_Dekomposisi,
  B48: B48_JawabanInti,
  B49: B49_MusuhDuniaKita,
  B50: B50_CTA,
  B51: B51_Penutup,
  B52: B52_KalimatAkhir,
};

// Direct continuous scene continuations stay hard-cut; all scene changes use unified PixelBlockWipe
const HARD_CUT_INCOMING = new Set<string>([
  'B12', // map -> freeze checkpoint Y2
  'B23', // dialog1 K -> dialog1 M
  'B25', // checkpoint Y10 -> langsung sambung tebakan B25
  'B28', // Omen M -> Omen K
  'B32', // Dika K -> Dika M
  'B39', // lights out dark -> Y20
  'B45', // verdict -> pixel rewind
  'B47', // 100x -> dekomposisi
  'B49', // jawaban part 1 -> part 2
  'B52', // night pullback -> kalimat akhir
]);

const SCENES: HpCutScene[] = HP_BEATS.map((b) => ({
  id: b.id,
  component: COMP_BY_ID[b.id],
  durationInFrames: b.durationInFrames,
  wipeIn: !HARD_CUT_INCOMING.has(b.id),
}));

/**
 * Full silent pixel-art composition: "Desa Tanpa HP vs Desa Bebas HP"
 * 1280x720, 30fps, 21350 frames, ZERO audio.
 */
export const FullVideo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: PX.bgDark}}>
    <PixelWipeSeries scenes={SCENES} />
    <HpGlobalHud />
  </AbsoluteFill>
);
