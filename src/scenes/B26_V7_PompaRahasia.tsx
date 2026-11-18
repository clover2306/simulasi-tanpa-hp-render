import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelBoard, PixelChip, PixelSprite} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {VignetteStage} from '../components/VignetteStage';

const DUR = 492; // 435.06 - 451.48s

const V7Phase: React.FC<{vDur: number; greenAt: number}> = ({vDur, greenAt}) => {
  const vf = useCurrentFrame();
  const greenU = interpolate(vf, [greenAt, vDur - 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lanternPulse = 0.78 + 0.22 * Math.sin(vf / 7);

  return (
    <VignetteStage
      dur={vDur}
      palette="night"
      river={greenU > 0.5 ? 'clear' : 'drought'}
      rightGrass={greenU > 0.45 ? '#3C7E38' : '#584E32'}
    >
      {/* Crescent moon */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 52,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#FBE8A6',
          boxShadow: 'inset -18px -6px 0 0 #0D1322',
        }}
      />

      {/* Green spreading from irrigation ditch */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 392,
          width: `${Math.round(greenU * 620)}px`,
          height: 86,
          background: '#489640',
          borderTop: '4px solid #7BD66A',
          opacity: 0.9,
        }}
      />

      {/* Secret pump + board */}
      <div style={{position: 'absolute', left: 320, top: 274}}>
        <PixelSprite src="pump.png" w={156} h={142} />
      </div>
      <PixelBoard title="POMPA SATU-SATUNYA" x={398} y={428} w={350} accent={PX.gold} />

      {/* Ujang installing pump with wrench */}
      <div style={{position: 'absolute', left: 170, top: 176}}>
        <PixelSprite src="portrait_ujang_wrench.png" w={122} h={252} />
      </div>

      {/* Sari holding warm glowing lantern */}
      <div style={{position: 'absolute', left: 570, top: 148}}>
        <PixelSprite src="portrait_sari_neutral.png" w={132} h={272} flipX />
        <div
          style={{
            position: 'absolute',
            left: -26,
            top: 120,
            width: 34,
            height: 44,
            background: '#FFCF56',
            border: '3px solid #2A1E0E',
            boxShadow: `0 0 ${Math.round(48 * lanternPulse)}px rgba(255, 205, 86, 0.85)`,
          }}
        />
      </div>

      {/* Mulyadi in background keeping lookout */}
      <div style={{position: 'absolute', left: 950, top: 118}}>
        <PixelSprite
          src="portrait_mulyadi_neutral.png"
          w={150}
          h={310}
          flipX={Math.floor(vf / 36) % 2 === 0}
        />
      </div>
      <PixelChip
        text="PAK MULYADI • DIAM-DIAM!"
        x={1025}
        y={438}
        centerX
        borderColor={PX.amber}
        color={PX.goldHi}
        fontSize={12}
      />

      <PixelChip
        text="JANGAN BILANG SIAPA-SIAPA"
        x={640}
        y={68}
        centerX
        borderColor={PX.gold}
        color={PX.gold}
        fontSize={13}
      />
    </VignetteStage>
  );
};

export const B26_V7_PompaRahasia: React.FC = () => {
  const f = useCurrentFrame();
  const v7Start = fullLocalF('B26', 436.96);

  if (f < v7Start) {
    return (
      <AbsoluteFill>
        <LiveMapBg era="y12" zoomFrom={1.04} zoomTo={1.12} dim={0.28} dur={v7Start} />
        <PixelChip
          text="TAHUN 13 • POMPA RAHASIA"
          x={640}
          y={76}
          centerX
          borderColor={PX.amber}
          color={PX.goldHi}
          fontSize={14}
        />
      </AbsoluteFill>
    );
  }

  return (
    <Sequence from={v7Start} durationInFrames={DUR - v7Start}>
      <V7Phase vDur={DUR - v7Start} greenAt={fullLocalF('B26', 446.88) - v7Start} />
    </Sequence>
  );
};
