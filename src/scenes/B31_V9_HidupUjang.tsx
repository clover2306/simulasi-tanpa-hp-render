import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {W} from '../lib/tokens';
import {fullLocalF} from '../fullPlan';
import {PX, PixelBoard, PixelChip, PixelSprite} from '../components/PixelUI';
import {VignetteStage} from '../components/VignetteStage';

const DUR = 782; // 575.76 - 601.84s

export const B31_V9_HidupUjang: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const rightStart = fullLocalF('B31', 586.14); // "Seandainya dia tidak pernah menyeberang..."
  const bothStart = fullLocalF('B31', 597.66); // "Orangnya sama. Pemimpinnya beda."

  const leftLit = f < rightStart || f >= bothStart ? 1 : 0.32;
  const rightLit = f >= rightStart ? 1 : 0.28;

  const coinCycle = (f % 60) / 60;
  const coinX = interpolate(coinCycle, [0, 1], [190, 495]);
  const coinY = 230 - Math.sin(coinCycle * Math.PI) * 58;

  const chipS = spring({
    frame: Math.max(0, f - bothStart),
    fps,
    config: {damping: 12, stiffness: 200},
  });

  return (
    <VignetteStage dur={DUR} palette="day" river="normal" splitGrass>
      {/* Left Half: YANG TERJADI (Full vivid color) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W / 2,
          height: 550,
          opacity: leftLit,
        }}
      >
        <PixelChip
          text="YANG TERJADI"
          x={160}
          y={68}
          centerX
          borderColor={PX.gold}
          color={PX.gold}
          fontSize={12}
        />

        {/* Pump + Ujang with wrench */}
        <div style={{position: 'absolute', left: 46, top: 274}}>
          <PixelSprite src="pump.png" w={122} h={112} />
        </div>
        <div style={{position: 'absolute', left: 164, top: 140}}>
          <PixelSprite src="portrait_ujang_wrench.png" w={132} h={272} />
        </div>

        {/* Money/coin sent across to mother's house in Tanjungsari */}
        <div style={{position: 'absolute', left: 454, top: 248}}>
          <PixelSprite src="house_thatch.png" w={128} h={120} />
        </div>
        <PixelBoard title="IBU" x={518} y={376} w={110} accent={PX.gold} />
        <div
          style={{
            position: 'absolute',
            left: coinX,
            top: coinY,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: PX.gold,
            border: '3px solid #754E1E',
          }}
        />
      </div>

      {/* Right Half: SEANDAINYA TAK MENYEBERANG (Desaturated, dashed frame, transparent shadow Ujang!) */}
      <div
        style={{
          position: 'absolute',
          left: W / 2,
          top: 0,
          width: W / 2,
          height: 550,
          opacity: rightLit,
          filter: 'saturate(0.25) contrast(0.92)',
          borderLeft: '4px dashed #9B958C',
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle scanline texture signaling counterfactual imagination */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 2px, transparent 6px)',
            pointerEvents: 'none',
          }}
        />

        <PixelChip
          text="SEANDAINYA TAK MENYEBERANG"
          x={320}
          y={68}
          centerX
          borderColor="#A8A298"
          color="#E2DDD4"
          fontSize={11}
        />

        {/* Dry field + single small harvest sack (NO numbers) */}
        <PixelBoard title="SAWAH DI TANJUNGSARI" x={200} y={392} w={340} accent="#A8A298" />
        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 306,
            width: 44,
            height: 52,
            background: '#9C8A68',
            border: '3px dashed #4E4638',
          }}
        />

        {/* Ujang as a TRANSPARENT SHADOW with dashed outline (NOT a second solid person!) */}
        <div
          style={{
            position: 'absolute',
            left: 146,
            top: 112,
            padding: 6,
            border: '3px dashed #E8E2D8',
            background: 'rgba(20, 18, 16, 0.22)',
          }}
        >
          <PixelSprite
            src="portrait_ujang_hoe.png"
            w={122}
            h={252}
            style={{opacity: 0.44, filter: 'grayscale(1) brightness(0.75)'}}
          />
        </div>

        {/* Mother waiting with lantern at house */}
        <div style={{position: 'absolute', left: 424, top: 170}}>
          <PixelSprite src="portrait_ibu.png" w={106} h={218} flipX />
        </div>
        <PixelBoard title="IBU MENUNGGU" x={486} y={392} w={210} accent="#A8A298" />
      </div>

      {/* Single connecting plate for ONE person: UJANG / HIDUP DUA KALI */}
      <PixelBoard
        title="UJANG"
        subtitle="HIDUP DUA KALI"
        x={640}
        y={14}
        w={270}
        accent={PX.gold}
      />

      {/* Closing center chip */}
      {f >= bothStart ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 452,
            translate: '-50% 0',
            transform: `scale(${chipS})`,
          }}
        >
          <PixelChip
            text="ORANGNYA SAMA. PEMIMPINNYA BEDA."
            borderColor={PX.gold}
            bg="#181512"
            color={PX.gold}
            fontSize={14}
          />
        </div>
      ) : null}
    </VignetteStage>
  );
};
