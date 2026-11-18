import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../demoPlan';
import {PIXEL_FONT} from '../pixelFont';
import {PX, PixelSprite} from './PixelUI';

export type Waypoint = [number, number];

export type SpritePrefix =
  | 'kevin'
  | 'mulyadi'
  | 'sari'
  | 'ujang'
  | 'dika'
  | 'endang'
  | 'harjo'
  | 'tia'
  | 'omen'
  | 'villager_red'
  | 'villager_blue'
  | 'villager_yellow'
  | 'villager_green';

export interface WalkerSpec {
  id: string;
  sprite: SpritePrefix;
  path: Waypoint[];
  speed?: number;
  startFrame?: number;
  loopMode?: 'pingpong' | 'cycle' | 'once';
  phase?: number;
  scale?: number;
  opacity?: number;
  label?: string;
  labelColor?: string;
  idleFacingLeft?: boolean;
  frameOverride?: number;
  frozen?: boolean;
  carryingPhone?: boolean;
  desaturated?: boolean;
  exclaim?: boolean;
  questionMark?: boolean;
  dirtyHands?: boolean;
  chatDot?: boolean;
}

export interface WalkerEval {
  x: number;
  y: number;
  facingLeft: boolean;
  stepIdx: number;
  moving: boolean;
}

export function evalWalker(
  frame: number,
  path: Waypoint[],
  opts: {
    speed?: number;
    startFrame?: number;
    loopMode?: 'pingpong' | 'cycle' | 'once';
    phase?: number;
    idleFacingLeft?: boolean;
  } = {},
): WalkerEval {
  const {
    speed = 52,
    startFrame = 0,
    loopMode = 'pingpong',
    phase = 0,
    idleFacingLeft = false,
  } = opts;

  if (path.length === 0) {
    return {x: 0, y: 0, facingLeft: idleFacingLeft, stepIdx: 0, moving: false};
  }
  if (path.length === 1) {
    return {x: path[0][0], y: path[0][1], facingLeft: idleFacingLeft, stepIdx: 0, moving: false};
  }

  const segLens: number[] = [];
  let totalLen = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const len = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]);
    segLens.push(len);
    totalLen += len;
  }

  if (totalLen < 0.5) {
    return {x: path[0][0], y: path[0][1], facingLeft: idleFacingLeft, stepIdx: 0, moving: false};
  }

  const elapsed = Math.max(0, frame - startFrame);
  const rawDist = elapsed * (speed / FPS) + phase * totalLen;

  let d = 0;
  let reverse = false;
  let moving = frame >= startFrame;

  if (loopMode === 'once') {
    if (rawDist >= totalLen) {
      d = totalLen;
      moving = false;
    } else {
      d = rawDist;
    }
  } else if (loopMode === 'cycle') {
    d = rawDist % totalLen;
  } else {
    const cycleLen = totalLen * 2;
    const m = rawDist % cycleLen;
    if (m <= totalLen) {
      d = m;
    } else {
      d = cycleLen - m;
      reverse = true;
    }
  }

  let acc = 0;
  let x = path[path.length - 1][0];
  let y = path[path.length - 1][1];
  let segDx = path[path.length - 1][0] - path[path.length - 2][0];

  for (let i = 0; i < segLens.length; i++) {
    const l = segLens[i];
    if (d <= acc + l || i === segLens.length - 1) {
      const t = l > 0.001 ? Math.min(1, Math.max(0, (d - acc) / l)) : 0;
      const a = path[i];
      const b = path[i + 1];
      x = a[0] + (b[0] - a[0]) * t;
      y = a[1] + (b[1] - a[1]) * t;
      segDx = reverse ? a[0] - b[0] : b[0] - a[0];
      break;
    }
    acc += l;
  }

  const facingLeft = Math.abs(segDx) > 0.5 ? segDx < 0 : idleFacingLeft;
  const stepIdx = moving ? Math.floor(rawDist / 10) % 4 : 0;

  return {x, y, facingLeft, stepIdx, moving};
}

export const Walker: React.FC<Omit<WalkerSpec, 'id'>> = ({
  sprite,
  path,
  speed = 52,
  startFrame = 0,
  loopMode = 'pingpong',
  phase = 0,
  scale = 1,
  opacity = 1,
  label,
  labelColor = PX.goldHi,
  idleFacingLeft = false,
  frameOverride,
  frozen = false,
  carryingPhone = false,
  desaturated = false,
  exclaim = false,
  questionMark = false,
  dirtyHands = false,
  chatDot = false,
}) => {
  const curF = useCurrentFrame();
  const f = frameOverride ?? curF;
  const ev = evalWalker(f, path, {speed, startFrame, loopMode, phase, idleFacingLeft});

  const w = Math.round(32 * scale);
  const h = Math.round(52 * scale);
  const bob = !frozen && ev.moving && (ev.stepIdx === 1 || ev.stepIdx === 3) ? -Math.min(6, 2 * scale) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: ev.x - w / 2,
        top: ev.y - h + bob,
        width: w,
        height: h,
        opacity,
        filter: desaturated ? 'grayscale(1) brightness(0.75) contrast(1.15)' : undefined,
        pointerEvents: 'none',
      }}
    >
      <PixelSprite src={`${sprite}_walk_${ev.stepIdx}.png`} w={w} h={h} flipX={ev.facingLeft} />
      {carryingPhone ? (
        <div
          style={{
            position: 'absolute',
            left: ev.facingLeft ? Math.round(2 * scale) : Math.round(18 * scale),
            top: Math.round(24 * scale),
            width: Math.max(8, Math.round(10 * scale)),
            height: Math.max(10, Math.round(12 * scale)),
          }}
        >
          <PixelSprite
            src="hp_hand.png"
            w={Math.max(8, Math.round(10 * scale))}
            h={Math.max(10, Math.round(12 * scale))}
          />
        </div>
      ) : null}
      {dirtyHands ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: Math.round(3 * scale),
              top: Math.round(29 * scale),
              width: Math.max(4, Math.round(5 * scale)),
              height: Math.max(4, Math.round(5 * scale)),
              background: '#2C221B',
              border: '1px solid #120E0B',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: Math.round(3 * scale),
              top: Math.round(29 * scale),
              width: Math.max(4, Math.round(5 * scale)),
              height: Math.max(4, Math.round(5 * scale)),
              background: '#2C221B',
              border: '1px solid #120E0B',
            }}
          />
        </>
      ) : null}
      {desaturated ? (
        <div
          style={{
            position: 'absolute',
            inset: -2,
            border: `2px solid ${PX.red}`,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      {exclaim ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: h + 3,
            translate: '-50% 0',
            background: '#2A1010',
            border: `2px solid ${PX.red}`,
            padding: '1px 4px',
            fontFamily: PIXEL_FONT,
            fontSize: 9,
            color: PX.red,
            lineHeight: 1,
          }}
        >
          !
        </div>
      ) : null}
      {questionMark && !exclaim ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: h + 3,
            translate: '-50% 0',
            background: '#262015',
            border: `2px solid ${PX.gold}`,
            padding: '1px 4px',
            fontFamily: PIXEL_FONT,
            fontSize: 8,
            color: PX.gold,
            lineHeight: 1,
          }}
        >
          ?
        </div>
      ) : null}
      {chatDot && !exclaim && !questionMark && !label ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: h + 2,
            translate: '-50% 0',
            background: '#FFFDF7',
            border: '2px solid #1E1814',
            padding: '1px 4px',
            fontFamily: PIXEL_FONT,
            fontSize: 7,
            color: '#1E1814',
            lineHeight: 1,
          }}
        >
          ..
        </div>
      ) : null}
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: h + 2,
            translate: '-50% 0',
            background: 'rgba(20, 18, 16, 0.92)',
            border: `2px solid ${labelColor}`,
            padding: '2px 5px',
            fontFamily: PIXEL_FONT,
            fontSize: 8,
            color: labelColor,
            whiteSpace: 'nowrap',
            lineHeight: 1.1,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
