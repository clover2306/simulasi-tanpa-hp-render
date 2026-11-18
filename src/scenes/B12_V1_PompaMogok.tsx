import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {W} from '../lib/tokens';
import {localF} from '../demoPlan';
import {
  CAPTION_SAFE_TOP,
  HUD_H,
  PX,
  PixelBoard,
  PixelBubble,
  PixelChip,
  PixelSprite,
  PixelStamp,
} from '../components/PixelUI';

const DUR = 387; // 156.68 - 169.58s
const STAGE_TOP = HUD_H; // 54
const STAGE_H = CAPTION_SAFE_TOP - HUD_H; // 606 (y: 54..660, caption zone >= 660 untouched)

export const B12_V1_PompaMogok: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const brokenAt = localF('B12', 157.74); // "Pompanya rusak melulu"
  const quoteAt = localF('B12', 164.85); // "Warga mulai bersungut-sungut: Pintar di sekolah, tapi di sawah?"

  // Curtain open (0..18f) and close (369..387f)
  const openU = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const closeU = interpolate(f, [DUR - 18, DUR], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  // 0 = closed, 1 = completely open off-screen
  const curtainOpen = openU * (1 - closeU);
  const curtainShift = curtainOpen * 660;

  // Pump sputter vibration during broken window
  const sputtering = f >= brokenAt && f < quoteAt + 40;
  const sputterX = sputtering ? Math.sin(f * 1.9) * 3 : 0;
  const sputterY = sputtering ? Math.abs(Math.cos(f * 2.3)) * -2 : 0;

  // Villager silhouette entrance
  const crowdS = spring({
    frame: Math.max(0, f - (quoteAt - 18)),
    fps,
    config: {damping: 15, stiffness: 160},
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#141210'}}>
      {/* Side-view Vignette Stage strictly inside y: 54..660 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: STAGE_TOP,
          width: W,
          height: STAGE_H,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #273752 0%, #4E6A85 52%, #7D98A8 72%)',
        }}
      >
        {/* Distant pixel hill silhouettes */}
        <div
          style={{
            position: 'absolute',
            left: -40,
            top: 300,
            width: 520,
            height: 150,
            background: '#385746',
            borderRadius: '50% 50% 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 420,
            top: 315,
            width: 540,
            height: 140,
            background: '#2E493B',
            borderRadius: '50% 50% 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 860,
            top: 295,
            width: 480,
            height: 160,
            background: '#385746',
            borderRadius: '50% 50% 0 0',
          }}
        />

        {/* Grass ground band (y local 382..498 -> screen 436..552) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 382,
            width: W,
            height: 116,
            background: '#548C46',
            borderTop: '6px solid #76B25E',
          }}
        />

        {/* River strip elevated above lower bank & 60px caption zone (y local 498..550 -> screen 552..604, 56px clear of y=660) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 498,
            width: W,
            height: 52,
            boxSizing: 'border-box',
            background: '#347EC8',
            borderTop: '6px solid #D8BA7E',
            borderBottom: '4px solid #1C4878',
            overflow: 'hidden',
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const sx = ((f * 3 + i * 175) % (W + 80)) - 40;
            const sy = 12 + (i % 3) * 10;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: sx,
                  top: sy,
                  width: 34,
                  height: 4,
                  background: '#9CD4FA',
                  opacity: 0.85,
                }}
              />
            );
          })}
        </div>

        {/* Far riverbank grass strip (y local 550..606 -> screen 604..660, caption zone >= 660 remains pure empty) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 550,
            width: W,
            height: 56,
            background: '#3C6934',
            borderTop: '4px solid #C8AA6E',
          }}
        />

        {/* Big Kevin on left (~half screen height = 310px) */}
        <div style={{position: 'absolute', left: 112, top: 116}}>
          <PixelSprite src="portrait_kevin_sad.png" w={150} h={310} />
        </div>
        <PixelChip
          text="KEVIN • VISIONER"
          x={187}
          y={438}
          centerX
          borderColor={PX.gold}
          fontSize={12}
        />

        {/* Smoking Pump + Signboard "POMPA AIR" */}
        <div
          style={{
            position: 'absolute',
            left: 368 + sputterX,
            top: 258 + sputterY,
          }}
        >
          <PixelSprite src="pump.png" w={184} h={168} />
        </div>

        {/* Animated pixel smoke puffs rising from the broken pump */}
        {[0, 1, 2, 3].map((i) => {
          const cycle = ((f + i * 14) % 56) / 56;
          const px = 428 + Math.sin(cycle * Math.PI * 2 + i) * 14;
          const py = 250 - cycle * 150;
          const sz = 22 + cycle * 26;
          const op = (1 - cycle) * 0.85;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: px,
                top: py,
                width: sz,
                height: sz,
                background: i % 2 === 0 ? '#5E5852' : '#8A827A',
                border: '2px solid #2A2622',
                opacity: op,
              }}
            />
          );
        })}

        <PixelBoard
          title="POMPA AIR"
          x={460}
          y={436}
          w={220}
          accent={PX.red}
        />

        {f >= brokenAt ? (
          <PixelStamp
            text="MOGOK!"
            x={460}
            y={202}
            at={brokenAt}
            color={PX.red}
            rot={-6}
            fontSize={16}
          />
        ) : null}

        {/* 3 Villager Silhouettes on the right */}
        <div
          style={{
            position: 'absolute',
            left: 790,
            top: 260,
            display: 'flex',
            gap: 48,
            opacity: crowdS,
            transform: `translateX(${(1 - crowdS) * 40}px)`,
          }}
        >
          {['villager_red_walk_0.png', 'villager_blue_walk_0.png', 'villager_yellow_walk_0.png'].map((sp, i) => (
            <PixelSprite
              key={sp}
              src={sp}
              w={84}
              h={136}
              flipX
              style={{
                filter: 'brightness(0.16) contrast(1.4)',
                transform: `scaleX(-1) translateY(${i === 1 ? -6 : 0}px)`,
              }}
            />
          ))}
        </div>
        <PixelChip
          text="WARGA SINARBARU"
          x={965}
          y={438}
          centerX
          borderColor={PX.amber}
          color={PX.amber}
          fontSize={12}
        />

        {/* Quote Bubble ("Pintar di sekolah, tapi di sawah?") */}
        <PixelBubble
          text="PINTAR DI SEKOLAH, TAPI DI SAWAH?"
          x={680}
          y={88}
          maxW={490}
          tail="bottom-right"
          accent={PX.ink}
          at={quoteAt}
        />

        {/* Dark Brown Pixel Curtains (open cleanly off-screen so they never clip plates/boards) */}
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
      </div>
    </AbsoluteFill>
  );
};
