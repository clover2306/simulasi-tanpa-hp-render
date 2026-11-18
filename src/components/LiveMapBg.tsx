import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {W, H} from '../lib/tokens';
import {PX, RiverShimmer} from './PixelUI';
import {Walker, evalWalker, type WalkerSpec} from './Walker';

export type MapEra =
  | 'y1'
  | 'y2'
  | 'y4'
  | 'y6'
  | 'drought'
  | 'y12'
  | 'y13'
  | 'y16'
  | 'cf';

export const LiveMapContext = React.createContext<'demo' | 'full'>('demo');

const PLATE_FILE: Record<MapEra, string> = {
  y1: 'plate_clean_y1.png',
  y2: 'plate_clean_y2.png',
  y4: 'plate_clean_y4.png',
  y6: 'plate_clean_y6.png',
  drought: 'plate_clean_drought.png',
  y12: 'plate_clean_y12.png',
  y13: 'plate_clean_y13.png',
  y16: 'plate_clean_y16.png',
  cf: 'plate_clean_cf.png',
};

function buildDefaultWalkers(era: MapEra): WalkerSpec[] {
  const isPostUjang = era === 'y6' || era === 'drought' || era === 'y12' || era === 'y13' || era === 'y16' || era === 'cf';
  const isExodusDone = era === 'y12' || era === 'y13';
  const isMarket = era === 'y16' || era === 'cf';

  const sinWalkers: WalkerSpec[] = [
    {
      id: 'sin_v1',
      sprite: 'villager_red',
      path: [[154, 198], [308, 198], [308, 122]],
      speed: 44,
      phase: 0.15,
    },
    {
      id: 'sin_v2',
      sprite: 'villager_blue',
      path: [[308, 224], [308, 412], [448, 412]],
      speed: 48,
      phase: 0.42,
    },
    {
      id: 'sin_v3',
      sprite: 'villager_yellow',
      path: [[96, 516], [285, 516], [285, 628], [460, 628]],
      speed: 46,
      phase: 0.68,
    },
    {
      id: 'sin_v4',
      sprite: 'villager_green',
      path: [[295, 420], [450, 420], [450, 516], [312, 516]],
      speed: 42,
      phase: 0.25,
    },
    {
      id: 'sin_v5',
      sprite: 'villager_red',
      path: [[308, 140], [308, 224], [446, 224]],
      speed: 38,
      phase: 0.77,
    },
    {
      id: 'sin_v6',
      sprite: 'villager_blue',
      path: [[154, 396], [330, 396], [330, 224]],
      speed: 40,
      phase: 0.51,
    },
    {
      id: 'kevin',
      sprite: 'kevin',
      path:
        era === 'y1' || era === 'y2' || era === 'y4'
          ? [[308, 224], [444, 224], [444, 396], [580, 396]]
          : [[308, 224], [308, 314], [444, 314], [444, 412]],
      speed: 46,
      phase: 0.1,
      label: 'KEVIN',
      labelColor: PX.gold,
    },
  ];

  // After exodus, more villagers live on the Sinarbaru side
  if (isExodusDone || isMarket) {
    sinWalkers.push(
      {
        id: 'sin_mig1',
        sprite: 'villager_blue',
        path: [[154, 420], [295, 420], [295, 516]],
        speed: 45,
        phase: 0.3,
      },
      {
        id: 'sin_mig2',
        sprite: 'villager_yellow',
        path: [[445, 224], [582, 224], [582, 314]],
        speed: 42,
        phase: 0.55,
      },
    );
  }

  // Ujang location depends on era
  const ujangWalker: WalkerSpec = isMarket
    ? {
        id: 'ujang',
        sprite: 'ujang',
        path: [[614, 316], [614, 368], [668, 368], [682, 316]],
        speed: 46,
        phase: 0.35,
        label: 'UJANG',
        labelColor: PX.gold,
      }
    : isPostUjang
      ? {
          id: 'ujang',
          sprite: 'ujang',
          path: [[308, 224], [308, 412], [455, 412]],
          speed: 50,
          phase: 0.22,
          label: 'UJANG',
          labelColor: PX.gold,
        }
      : {
          id: 'ujang',
          sprite: 'ujang',
          path: [[756, 224], [756, 316], [968, 316]],
          speed: 48,
          phase: 0.28,
          label: 'UJANG',
          labelColor: PX.green,
        };

  const tanWalkers: WalkerSpec[] = [
    {
      id: 'mulyadi',
      sprite: 'mulyadi',
      path: [[876, 316], [975, 316], [1055, 316]],
      speed: 32,
      phase: 0.2,
      label: 'MULYADI',
      labelColor: PX.green,
    },
    {
      id: 'sari',
      sprite: 'sari',
      path: isMarket
        ? [[786, 316], [786, 418], [965, 418]]
        : [[778, 224], [965, 224], [965, 316]],
      speed: 44,
      phase: 0.45,
      label: 'SARI',
      labelColor: PX.green,
    },
  ];

  if (!isExodusDone) {
    tanWalkers.push(
      {
        id: 'tan_v1',
        sprite: 'villager_blue',
        path: [[778, 224], [1140, 224]],
        speed: 44,
        phase: 0.12,
      },
      {
        id: 'tan_v2',
        sprite: 'villager_green',
        path: [[980, 126], [980, 316], [1155, 316]],
        speed: 46,
        phase: 0.58,
      },
      {
        id: 'tan_v3',
        sprite: 'villager_yellow',
        path: [[785, 516], [960, 516], [960, 628], [1150, 628]],
        speed: 42,
        phase: 0.34,
      },
      {
        id: 'tan_v4',
        sprite: 'villager_red',
        path: [[785, 398], [965, 398], [965, 516]],
        speed: 40,
        phase: 0.81,
      },
    );
  } else {
    // Only 1 elderly villager remains with Mulyadi & Sari in the abandoned village
    tanWalkers.push({
      id: 'tan_elder',
      sprite: 'villager_yellow',
      path: [[880, 516], [970, 516]],
      speed: 28,
      phase: 0.4,
    });
  }

  return [...sinWalkers, ujangWalker, ...tanWalkers];
}

export const LiveMapBg: React.FC<{
  era?: MapEra;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: [number, number];
  panY?: [number, number];
  dim?: number;
  blurPx?: number;
  shimmer?: boolean;
  dur?: number;
  customWalkers?: WalkerSpec[];
  extraWalkers?: WalkerSpec[];
  hideIds?: string[];
}> = ({
  era = 'y1',
  zoomFrom = 1,
  zoomTo = 1.05,
  panX = [0, 0],
  panY = [0, 0],
  dim = 0.15,
  blurPx = 0,
  shimmer = true,
  dur = 300,
  customWalkers,
  extraWalkers = [],
  hideIds = [],
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, Math.max(1, dur)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sc = zoomFrom + (zoomTo - zoomFrom) * p;
  const tx = panX[0] + (panX[1] - panX[0]) * p;
  const ty = panY[0] + (panY[1] - panY[0]) * p;

  const baseList = customWalkers ?? buildDefaultWalkers(era);
  const allWalkers = [...baseList.filter((w) => !hideIds.includes(w.id)), ...extraWalkers];

  // Y-sort walkers so lower characters naturally overlap upper ones
  const sortedWalkers = allWalkers
    .map((w) => ({
      spec: w,
      y: evalWalker(f, w.path, {
        speed: w.speed,
        startFrame: w.startFrame,
        loopMode: w.loopMode,
        phase: w.phase,
        idleFacingLeft: w.idleFacingLeft,
      }).y,
    }))
    .sort((a, b) => a.y - b.y);

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#1B2A18'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`,
          transformOrigin: '50% 50%',
          filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
        }}
      >
        <Img
          src={staticFile(`sprites/${PLATE_FILE[era]}`)}
          className="pixel-img"
          style={{width: W, height: H, objectFit: 'cover', imageRendering: 'pixelated'}}
        />
        {shimmer ? <RiverShimmer opacity={era === 'drought' ? 0.45 : 0.85} /> : null}

        {/* Animated walkers anchored on the map ground */}
        {sortedWalkers.map(({spec}) => (
          <Walker
            key={spec.id}
            sprite={spec.sprite}
            path={spec.path}
            speed={spec.speed}
            startFrame={spec.startFrame}
            loopMode={spec.loopMode}
            phase={spec.phase}
            scale={spec.scale}
            opacity={spec.opacity}
            label={spec.label}
            labelColor={spec.labelColor}
            idleFacingLeft={spec.idleFacingLeft}
          />
        ))}
      </AbsoluteFill>

      {dim > 0 ? <AbsoluteFill style={{backgroundColor: '#0A0908', opacity: dim}} /> : null}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.48) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
