import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {W, H} from '../lib/tokens';
import {PX, PixelSprite} from '../components/PixelUI';
import {Walker, evalWalker, type WalkerSpec} from '../components/Walker';
import {pxSnap} from './plan';
import {SekatBar} from './hud';

export type MapFocus = 'dual' | 'left' | 'right';

export interface ParallelMapProps {
  focus?: MapFocus;
  focusStrength?: number; // 0..1 stepped
  dimAll?: number;
  dimLeft?: number;
  dimRight?: number;
  showMekarsariTower?: boolean;
  mekarsariHasPhones?: boolean;
  kertajayaPocketSearch?: boolean;
  showKertajayaRerunTower?: boolean;
  scamWave?: number; // 0..1 escalation in B26
  marketTier?: 0 | 1 | 2; // Endang's market growth in Mekarsari
  freezeWindow?: [number, number]; // [freezeStartF, freezeEndF] local frames for A1 checkpoints
  frameOverride?: number; // e.g. for rewind/fast-replay in B45
  extraWalkers?: WalkerSpec[];
  hideDefaultWalkers?: boolean;
  fastBubbles?: boolean;
  cleanMekarsariBubbles?: boolean; // e.g. B46 world where scam doesn't come
  earlyNightKertajaya?: boolean; // B11 week 3 early sleep
  children?: React.ReactNode;
}

function buildLivingWalkers(opts: {
  scamWave: number;
  rerunPostY10: boolean;
  mekarsariHasPhones: boolean;
  kertajayaPocketSearch: boolean;
}): WalkerSpec[] {
  const {scamWave, rerunPostY10, mekarsariHasPhones, kertajayaPocketSearch} = opts;

  // KERTAJAYA (LEFT, x strictly inside [108..572], plaza [226..454, 288..496])
  const kertajayaWalkers: WalkerSpec[] = [
    {
      id: 'k_dika',
      sprite: 'dika',
      path: [
        [242, 304],
        [342, 304],
        [342, 372],
      ],
      speed: 40,
      phase: 0.12,
      questionMark: kertajayaPocketSearch,
    },
    {
      id: 'k_endang',
      sprite: 'endang',
      path: [
        [246, 468],
        [356, 468],
      ],
      speed: 34,
      phase: 0.35,
      chatDot: !kertajayaPocketSearch,
    },
    {
      id: 'k_harjo',
      sprite: 'harjo',
      path: [
        [374, 344],
        [446, 344],
        [446, 436],
      ],
      speed: 36,
      phase: 0.52,
      carryingPhone: rerunPostY10,
      questionMark: kertajayaPocketSearch,
    },
    {
      id: 'k_tia',
      sprite: 'tia',
      path: [
        [236, 396],
        [318, 396],
      ],
      speed: 34,
      phase: 0.22,
      chatDot: !kertajayaPocketSearch,
      questionMark: kertajayaPocketSearch,
    },
    {
      id: 'k_omen',
      sprite: 'omen',
      path: [
        [108, 224],
        [108, 468],
      ],
      speed: 38,
      phase: 0.64,
    },
    {
      id: 'k_v1',
      sprite: 'villager_green',
      path: [
        [324, 398],
        [424, 398],
      ],
      speed: 36,
      phase: 0.75,
      chatDot: !kertajayaPocketSearch,
    },
    {
      id: 'k_v2',
      sprite: 'villager_yellow',
      path: [
        [572, 196],
        [572, 512],
      ],
      speed: 38,
      phase: 0.41,
      carryingPhone: rerunPostY10,
    },
    // Children playing outdoors in Kertajaya plaza (dark-haired young sprites)
    {
      id: 'k_child1',
      sprite: 'villager_red',
      path: [
        [268, 434],
        [342, 434],
        [342, 488],
        [268, 488],
      ],
      speed: 54,
      loopMode: 'cycle',
      phase: 0.18,
      scale: 0.74,
    },
    {
      id: 'k_child2',
      sprite: 'villager_blue',
      path: [
        [386, 462],
        [446, 462],
        [446, 492],
      ],
      speed: 50,
      phase: 0.58,
      scale: 0.74,
    },
  ];

  // MEKARSARI (RIGHT, x strictly inside [702..1170], plaza [810..1036, 288..436])
  // When mekarsariHasPhones === false (start of B01 before rule is applied), mirrors Kertajaya identically!
  if (!mekarsariHasPhones) {
    const mirrorOffset = 640;
    const mirroredWalkers: WalkerSpec[] = kertajayaWalkers.map((kw) => ({
      ...kw,
      id: kw.id.replace(/^k_/, 'm_'),
      path: kw.path.map(([px, py]) => [
        Math.min(1170, Math.max(702, px + (kw.id === 'k_omen' ? 594 : kw.id === 'k_v2' ? 598 : mirrorOffset - 56))),
        Math.min(436, py),
      ]),
      carryingPhone: false,
      questionMark: false,
    }));
    return [...kertajayaWalkers, ...mirroredWalkers];
  }

  const scamHit1 = scamWave > 0.35;
  const scamHit2 = scamWave > 0.55;
  const scamHit3 = scamWave > 0.72;

  const mekarsariWalkers: WalkerSpec[] = [
    {
      id: 'm_dika',
      sprite: 'dika',
      path: [
        [824, 308],
        [928, 308],
      ],
      speed: 28,
      phase: 0.18,
      carryingPhone: true,
    },
    {
      id: 'm_endang',
      sprite: 'endang',
      path: [
        [948, 424],
        [1028, 424],
      ],
      speed: 36,
      phase: 0.42,
      carryingPhone: true,
    },
    {
      id: 'm_harjo',
      sprite: 'harjo',
      path: [
        [822, 378],
        [904, 378],
      ],
      speed: 26,
      phase: 0.66,
      carryingPhone: true,
      desaturated: scamHit2,
      exclaim: scamWave > 0.45 && scamWave < 0.8,
    },
    {
      id: 'm_tia',
      sprite: 'tia',
      path: [
        [962, 336],
        [1032, 336],
      ],
      speed: 24,
      phase: 0.31,
      carryingPhone: true,
    },
    {
      id: 'm_omen',
      sprite: 'omen',
      path: [
        [702, 232],
        [702, 476],
      ],
      speed: 36,
      phase: 0.5,
    },
    {
      id: 'm_v1',
      sprite: 'villager_blue',
      path: [
        [832, 428],
        [924, 428],
      ],
      speed: 30,
      phase: 0.14,
      carryingPhone: true,
      desaturated: scamHit1,
      exclaim: scamWave > 0.25 && scamWave < 0.75,
    },
    {
      id: 'm_v2',
      sprite: 'villager_yellow',
      path: [
        [1170, 198],
        [1170, 514],
      ],
      speed: 34,
      phase: 0.72,
      carryingPhone: true,
      desaturated: scamHit3,
      exclaim: scamWave > 0.6,
    },
    {
      id: 'm_v3',
      sprite: 'villager_red',
      path: [
        [886, 344],
        [886, 424],
      ],
      speed: 28,
      phase: 0.85,
      carryingPhone: true,
      desaturated: scamHit1,
    },
  ];

  return [...kertajayaWalkers, ...mekarsariWalkers];
}

const SignalRings: React.FC<{
  cx: number;
  cy: number;
  frame: number;
  danger?: boolean;
}> = ({cx, cy, frame, danger = false}) => {
  const color = danger ? PX.red : '#7CE0FF';
  return (
    <>
      {[0, 1, 2].map((i) => {
        const u = ((frame * (danger ? 2.4 : 1.3) + i * 28) % 84) / 84;
        const r = Math.round((16 + u * 88) / 4) * 4;
        const op = (1 - u) * (danger ? 0.85 : 0.62);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - r,
              top: cy - r,
              width: r * 2,
              height: r * 2,
              border: `3px solid ${color}`,
              opacity: op,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
};

export const ParallelMapStage: React.FC<ParallelMapProps> = ({
  focus = 'dual',
  focusStrength = 1,
  dimAll = 0,
  dimLeft = 0,
  dimRight = 0,
  showMekarsariTower = true,
  mekarsariHasPhones = true,
  kertajayaPocketSearch = false,
  showKertajayaRerunTower = false,
  scamWave = 0,
  marketTier = 0,
  freezeWindow,
  frameOverride,
  extraWalkers = [],
  hideDefaultWalkers = false,
  fastBubbles = false,
  cleanMekarsariBubbles = false,
  earlyNightKertajaya = false,
  children,
}) => {
  const rawF = useCurrentFrame();

  // Compute effective walker frame (supports freezeWindow for A1 checkpoints and frameOverride for B45 rerun)
  let wf = frameOverride ?? rawF;
  let isFrozenNow = false;
  if (freezeWindow && frameOverride === undefined) {
    const [fs, fe] = freezeWindow;
    if (rawF >= fs && rawF < fe) {
      wf = fs;
      isFrozenNow = true;
    } else if (rawF >= fe) {
      wf = fs + (rawF - fe);
    }
  }

  // Pixel-grid stepped camera zoom/pan: keeps BOTH plates visible even when focused on one!
  const u = focus === 'dual' ? 0 : focusStrength;
  const targetScale = 1 + 0.24 * u;
  const sc = Math.round(targetScale * 100) / 100;
  const rawPanX = focus === 'left' ? 136 * u : focus === 'right' ? -136 * u : 0;
  const tx = pxSnap(rawPanX, 4);

  const autoDimLeft = focus === 'right' ? Math.max(dimLeft, 0.52 * u) : dimLeft;
  const autoDimRight = focus === 'left' ? Math.max(dimRight, 0.52 * u) : dimRight;

  const baseWalkers = hideDefaultWalkers
    ? []
    : buildLivingWalkers({
        scamWave,
        rerunPostY10: showKertajayaRerunTower,
        mekarsariHasPhones,
        kertajayaPocketSearch,
      });
  const allWalkers = [...baseWalkers, ...extraWalkers];

  const sortedWalkers = allWalkers
    .map((w) => ({
      spec: w,
      y: evalWalker(w.frameOverride ?? wf, w.path, {
        speed: w.speed,
        startFrame: w.startFrame,
        loopMode: w.loopMode,
        phase: w.phase,
        idleFacingLeft: w.idleFacingLeft,
      }).y,
    }))
    .sort((a, b) => a.y - b.y);

  // Floating message bubbles inside Mekarsari (x strictly > 720)
  const bubbleAnchors: Array<[number, number, number, number]> = [
    [1044, 512, 816, 292],
    [1044, 512, 1018, 310],
    [816, 330, 1024, 412],
    [1036, 420, 790, 460],
  ];

  // Identical cloud shadow drift across BOTH villages simultaneously (Nasib Acak Sama)
  const cloudShift = pxSnap(((wf * 0.6) % 320) - 160, 4);

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#121810'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, 0px) scale(${sc})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Scaled 1280x720 generated top-down parallel map */}
        <Img
          src={staticFile('backgrounds/bg_peta_atas.png')}
          className="pixel-img"
          style={{width: W, height: H, imageRendering: 'pixelated'}}
        />

        {/* Identical stepped pixel cloud shadow drifting across both villages ("nasib acak sama") */}
        {[180, 820].map((baseX) => (
          <div
            key={baseX}
            style={{
              position: 'absolute',
              left: baseX + cloudShift,
              top: 246,
              pointerEvents: 'none',
            }}
          >
            <div style={{marginLeft: 28, width: 124, height: 14, background: 'rgba(18,28,18,0.1)'}} />
            <div style={{width: 180, height: 22, background: 'rgba(18,28,18,0.1)'}} />
            <div style={{marginLeft: 20, width: 140, height: 12, background: 'rgba(18,28,18,0.1)'}} />
          </div>
        ))}

        {/* Endang's Market Growth overlay on Mekarsari (sprite overlay on plate) */}
        {marketTier >= 1 ? (
          <>
            <PixelSprite src="stall_endang.png" x={984} y={452} w={58} h={46} />
            <PixelSprite src="basket_goods.png" x={958} y={474} w={24} h={22} />
          </>
        ) : null}
        {marketTier >= 2 ? (
          <>
            <PixelSprite src="stall_blue.png" x={906} y={456} w={50} h={40} />
            <PixelSprite src="basket_goods.png" x={1044} y={474} w={24} h={22} />
          </>
        ) : null}

        {/* Kertajaya Rerun Signal Tower (ONLY in B45 after Y10) */}
        {showKertajayaRerunTower ? (
          <>
            <SignalRings cx={275} cy={146} frame={wf} />
            <PixelSprite src="signal_tower.png" x={250} y={132} w={50} h={82} />
          </>
        ) : null}

        {/* Mekarsari Signal Tower in bottom-right open lawn */}
        {showMekarsariTower ? (
          <>
            <SignalRings cx={1044} cy={514} frame={wf} danger={scamWave > 0.1} />
            <PixelSprite src="signal_tower.png" x={1016} y={500} w={56} h={90} />
          </>
        ) : null}

        {/* Living Walkers sorted by foot Y */}
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
            frameOverride={spec.frameOverride ?? wf}
            frozen={isFrozenNow}
            carryingPhone={spec.carryingPhone}
            desaturated={spec.desaturated}
            exclaim={spec.exclaim}
            questionMark={spec.questionMark}
            dirtyHands={spec.dirtyHands}
            chatDot={spec.chatDot}
          />
        ))}

        {/* Floating chat/scam bubbles in Mekarsari */}
        {showMekarsariTower && !cleanMekarsariBubbles
          ? bubbleAnchors.map(([x0, y0, x1, y1], idx) => {
              const spd = fastBubbles ? 2.6 : scamWave > 0.1 ? 2.1 : 1.0;
              const uB = ((wf * spd + idx * 23) % 90) / 90;
              const bx = pxSnap(x0 + (x1 - x0) * uB, 2);
              const by = pxSnap(y0 + (y1 - y0) * uB - Math.sin(uB * Math.PI) * 18, 2);
              const isScam = scamWave > 0.2 && idx % 2 === 0;
              return (
                <PixelSprite
                  key={`mb-${idx}`}
                  src={isScam ? 'bubble_scam.png' : 'bubble_msg.png'}
                  x={bx}
                  y={by}
                  w={isScam ? 30 : 24}
                  h={isScam ? 24 : 19}
                  style={{opacity: 0.9}}
                />
              );
            })
          : null}

        {/* Early sleep dusk tint on Kertajaya in B11 */}
        {earlyNightKertajaya ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: W / 2 - 5,
              height: H,
              background: 'rgba(14, 22, 42, 0.28)',
              pointerEvents: 'none',
            }}
          />
        ) : null}

        {/* Per-side dim overlays (keeps secondary plate visible & dimmed when focused) */}
        {autoDimLeft > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: W / 2 - 4,
              height: H,
              background: '#08080C',
              opacity: autoDimLeft,
              pointerEvents: 'none',
            }}
          />
        ) : null}
        {autoDimRight > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: W / 2 + 4,
              top: 0,
              width: W / 2 - 4,
              height: H,
              background: '#08080C',
              opacity: autoDimRight,
              pointerEvents: 'none',
            }}
          />
        ) : null}

        {/* Unbreakable Parallel World Divider */}
        <SekatBar x={W / 2} top={0} height={H} />
      </AbsoluteFill>

      {dimAll > 0 ? (
        <AbsoluteFill
          style={{backgroundColor: '#0A0908', opacity: dimAll, pointerEvents: 'none', zIndex: 38}}
        />
      ) : null}

      {children}
    </AbsoluteFill>
  );
};
