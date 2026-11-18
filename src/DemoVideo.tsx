import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import './pixelFont';
import {PaperDefs} from './lib/paper/kit';
import {CutSeries, type CutScene, type CutSpec} from './lib/paper/transitions';
import {BEATS, TOTAL_FRAMES} from './demoPlan';
import {GlobalHud, PX} from './components/PixelUI';
import {B01_ColdOpen} from './scenes/B01_ColdOpen';
import {B02_ShowcaseKevin} from './scenes/B02_ShowcaseKevin';
import {B03_ShowcaseMulyadi} from './scenes/B03_ShowcaseMulyadi';
import {B04_Taruhan} from './scenes/B04_Taruhan';
import {B05_M1_GembokTuas} from './scenes/B05_M1_GembokTuas';
import {B06_AturanTeknologi} from './scenes/B06_AturanTeknologi';
import {B07_AturanRencana} from './scenes/B07_AturanRencana';
import {B08_AturanBelajar} from './scenes/B08_AturanBelajar';
import {B09_SatuPembedaTahun1} from './scenes/B09_SatuPembedaTahun1';
import {B10_M2_LumbungTerkuras} from './scenes/B10_M2_LumbungTerkuras';
import {B11_WargaBertanya} from './scenes/B11_WargaBertanya';
import {B12_V1_PompaMogok} from './scenes/B12_V1_PompaMogok';
import {B13_KontrasTanjungsari} from './scenes/B13_KontrasTanjungsari';

const COMP_BY_ID: Record<string, React.ComponentType> = {
  B01: B01_ColdOpen,
  B02: B02_ShowcaseKevin,
  B03: B03_ShowcaseMulyadi,
  B04: B04_Taruhan,
  B05: B05_M1_GembokTuas,
  B06: B06_AturanTeknologi,
  B07: B07_AturanRencana,
  B08: B08_AturanBelajar,
  B09: B09_SatuPembedaTahun1,
  B10: B10_M2_LumbungTerkuras,
  B11: B11_WargaBertanya,
  B12: B12_V1_PompaMogok,
  B13: B13_KontrasTanjungsari,
};

const SCENES: CutScene[] = BEATS.map((b) => ({
  id: b.id,
  component: COMP_BY_ID[b.id],
  durationInFrames: b.durationInFrames,
}));

// Transitions keyed by INCOMING beat id (B12/B13 use B12's own pixel curtains -> hard cut)
const CUTS: Record<string, CutSpec> = {
  B02: {kind: 'zoomThrough', x: 320, y: 340, scale: 4, frames: 8, align: 'mid'},
  B03: {kind: 'whip', blur: 32, frames: 8, align: 'mid'},
  B04: {kind: 'whip', blur: 32, frames: 8, align: 'mid'},
  B05: {kind: 'tapePull', y: 160, frames: 10, align: 'mid'},
  B06: {kind: 'pageTurn', style: 'fold', frames: 10, align: 'after'},
  B07: {kind: 'whip', blur: 28, frames: 7, align: 'after'},
  B08: {kind: 'whip', blur: 28, frames: 7, align: 'after'},
  B09: {kind: 'pageTurn', style: 'curl', frames: 10, align: 'mid'},
  B10: {kind: 'zoomThrough', x: 640, y: 360, scale: 4, frames: 8, align: 'mid'},
  B11: {kind: 'tapePull', y: 160, frames: 10, align: 'mid'},
};

export const DemoVideo: React.FC = () => {
  const f = useCurrentFrame();
  const fadeBlack = interpolate(f, [TOTAL_FRAMES - 20, TOTAL_FRAMES - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: PX.bgDark}}>
      <PaperDefs />
      <CutSeries scenes={SCENES} cuts={CUTS} />
      <GlobalHud />
      {fadeBlack > 0 ? (
        <AbsoluteFill style={{backgroundColor: '#000', opacity: fadeBlack, zIndex: 90}} />
      ) : null}
    </AbsoluteFill>
  );
};
