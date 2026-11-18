import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {W} from '../lib/tokens';
import {CAPTION_SAFE_TOP, HUD_H, PX} from './PixelUI';

export const STAGE_TOP = HUD_H; // 54
export const STAGE_H = CAPTION_SAFE_TOP - HUD_H; // 606 (screen y: 54..660)

export type StagePalette = 'day' | 'drought' | 'dusk' | 'night' | 'warm';
export type RiverMode = 'normal' | 'drought' | 'clear' | 'none';

const SKY_GRAD: Record<StagePalette, string> = {
  day: 'linear-gradient(180deg, #273752 0%, #4E6A85 52%, #7D98A8 72%)',
  drought: 'linear-gradient(180deg, #5C3824 0%, #9E683B 50%, #D9A05B 74%)',
  dusk: 'linear-gradient(180deg, #241F3A 0%, #593B4E 50%, #9E6648 75%)',
  night: 'linear-gradient(180deg, #0D1322 0%, #17233B 55%, #23334F 78%)',
  warm: 'linear-gradient(180deg, #3A2246 0%, #944C32 48%, #DE964E 76%)',
};

const HILL_COLORS: Record<StagePalette, [string, string]> = {
  day: ['#385746', '#2E493B'],
  drought: ['#6D5634', '#5A4628'],
  dusk: ['#353242', '#2B2836'],
  night: ['#162422', '#101B19'],
  warm: ['#4D4032', '#3D3226'],
};

export const VignetteStage: React.FC<{
  dur: number;
  palette?: StagePalette;
  river?: RiverMode;
  leftGrass?: string;
  rightGrass?: string;
  splitGrass?: boolean;
  curtain?: boolean;
  curtainOpenF?: number;
  curtainCloseF?: number;
  children: React.ReactNode;
}> = ({
  dur,
  palette = 'day',
  river = 'normal',
  leftGrass,
  rightGrass,
  splitGrass = false,
  curtain = true,
  curtainOpenF = 16,
  curtainCloseF = 16,
  children,
}) => {
  const f = useCurrentFrame();

  const openU =
    curtainOpenF <= 0
      ? 1
      : interpolate(f, [0, curtainOpenF], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
  const closeU =
    curtainCloseF <= 0
      ? 0
      : interpolate(f, [dur - curtainCloseF, dur], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        });
  const curtainOpen = openU * (1 - closeU);
  const curtainShift = curtainOpen * 660;

  const [hillA, hillB] = HILL_COLORS[palette];
  const defaultGrass =
    palette === 'drought'
      ? '#A88C4C'
      : palette === 'night'
        ? '#26402B'
        : palette === 'dusk'
          ? '#465F3A'
          : '#548C46';

  const gLeft = leftGrass ?? (splitGrass ? '#6DC252' : defaultGrass);
  const gRight = rightGrass ?? (splitGrass ? defaultGrass : defaultGrass);
  const topBorder =
    palette === 'drought' ? '#C4A868' : palette === 'night' ? '#3B6042' : '#76B25E';

  const waterColor =
    river === 'drought' ? '#2B5B82' : river === 'clear' ? '#409CE0' : '#347EC8';
  const waterH = river === 'drought' ? 28 : 52;
  const waterTop = river === 'drought' ? 510 : 498;

  return (
    <AbsoluteFill style={{backgroundColor: '#141210'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: STAGE_TOP,
          width: W,
          height: STAGE_H,
          overflow: 'hidden',
          background: SKY_GRAD[palette],
        }}
      >
        {/* Distant pixel hills */}
        <div
          style={{
            position: 'absolute',
            left: -40,
            top: 280,
            width: 520,
            height: 140,
            background: hillA,
            borderRadius: '50% 50% 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 420,
            top: 295,
            width: 540,
            height: 130,
            background: hillB,
            borderRadius: '50% 50% 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 860,
            top: 275,
            width: 480,
            height: 150,
            background: hillA,
            borderRadius: '50% 50% 0 0',
          }}
        />

        {/* Ground band (local 382..606 -> screen 436..660) */}
        {splitGrass ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 382,
                width: W / 2,
                height: 224,
                background: gLeft,
                borderTop: '6px solid #96DF70',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: W / 2,
                top: 382,
                width: W / 2,
                height: 224,
                background: gRight,
                borderTop: `6px solid ${topBorder}`,
              }}
            />
          </>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 382,
              width: W,
              height: 224,
              background: gLeft,
              borderTop: `6px solid ${topBorder}`,
            }}
          />
        )}

        {/* River strip elevated safely above 60px caption zone (y >= 660) */}
        {river !== 'none' ? (
          <>
            {river === 'drought' ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 498,
                  width: W,
                  height: 52,
                  background: '#B89B64',
                  borderTop: '4px solid #8C7245',
                  borderBottom: '4px solid #8C7245',
                }}
              />
            ) : null}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: waterTop,
                width: W,
                height: waterH,
                boxSizing: 'border-box',
                background: waterColor,
                borderTop: '5px solid #D8BA7E',
                borderBottom: '4px solid #1C4878',
                overflow: 'hidden',
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const sx = ((f * 3 + i * 175) % (W + 80)) - 40;
                const sy = river === 'drought' ? 7 + (i % 2) * 8 : 12 + (i % 3) * 10;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: sx,
                      top: sy,
                      width: river === 'drought' ? 22 : 34,
                      height: 4,
                      background: '#9CD4FA',
                      opacity: river === 'drought' ? 0.55 : 0.85,
                    }}
                  />
                );
              })}
            </div>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 550,
                width: W,
                height: 56,
                background: palette === 'night' ? '#1C3020' : palette === 'drought' ? '#7D6838' : '#3C6934',
                borderTop: '4px solid #C8AA6E',
              }}
            />
          </>
        ) : null}

        {children}

        {/* Dark Brown Pixel Curtains */}
        {curtain ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 644,
                height: STAGE_H,
                transform: `translateX(${-curtainShift}px)`,
                background:
                  'repeating-linear-gradient(90deg, #3A2214 0px, #3A2214 36px, #2A170D 36px, #2A170D 56px)',
                borderRight: `6px solid ${PX.gold}`,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 644,
                height: STAGE_H,
                transform: `translateX(${curtainShift}px)`,
                background:
                  'repeating-linear-gradient(90deg, #3A2214 0px, #3A2214 36px, #2A170D 36px, #2A170D 56px)',
                borderLeft: `6px solid ${PX.gold}`,
                pointerEvents: 'none',
              }}
            />
          </>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
