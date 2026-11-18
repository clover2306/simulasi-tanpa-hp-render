import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelBoard, PixelBubble, PixelChip, PixelSprite} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {VignetteStage} from '../components/VignetteStage';

const DUR = 402; // 343.62 - 357.04s

const V5Phase: React.FC<{vDur: number; rejectAt: number}> = ({vDur, rejectAt}) => {
  const vf = useCurrentFrame();

  // Envoy enters from left (18..82f), holds offer, then retreats left after rejection
  const enterU = interpolate(vf, [18, 82], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const leaveU = interpolate(vf, [rejectAt + 90, vDur - 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const envoyX = 110 + enterU * 190 - leaveU * 240;
  const moving = (vf >= 18 && vf <= 82) || (vf >= rejectAt + 90 && vf <= vDur - 24);
  const step = moving ? Math.floor(vf / 5) % 4 : 0;
  const retreating = vf >= rejectAt + 90;

  return (
    <VignetteStage dur={vDur} palette="drought" river="drought" splitGrass>
      {/* Blazing pixel sun */}
      <div
        style={{
          position: 'absolute',
          left: 596,
          top: 28,
          width: 88,
          height: 88,
          background: '#FFD866',
          border: '4px solid #F59E36',
          boxShadow: '0 0 36px rgba(255, 200, 80, 0.55)',
        }}
      />

      {/* Envoy from Sinarbaru offering loan pump */}
      <div style={{position: 'absolute', left: envoyX, top: 244}}>
        <PixelSprite src={`villager_blue_walk_${step}.png`} w={92} h={148} flipX={retreating} />
        <div style={{position: 'absolute', left: 76, top: 36}}>
          <PixelSprite src="pump.png" w={106} h={96} />
        </div>
      </div>
      <PixelBoard
        title="POMPA PINJAMAN"
        x={envoyX + 94}
        y={428}
        w={240}
        accent={PX.blueLight}
      />

      {/* Cracked dry earth beneath Mulyadi */}
      <svg
        width={420}
        height={100}
        viewBox="0 0 420 100"
        style={{position: 'absolute', right: 40, top: 396, pointerEvents: 'none'}}
      >
        <path d="M40 16 L88 46 L70 84" fill="none" stroke="#5E4622" strokeWidth={4} />
        <path d="M190 12 L222 44 L205 88" fill="none" stroke="#5E4622" strokeWidth={4} />
        <path d="M310 18 L280 54 L322 86" fill="none" stroke="#5E4622" strokeWidth={4} />
      </svg>

      {/* Big Pak Mulyadi turning face away and refusing */}
      <div style={{position: 'absolute', left: 950, top: 118}}>
        <PixelSprite
          src="portrait_mulyadi_stern.png"
          w={150}
          h={310}
          flipX={vf < rejectAt}
        />
      </div>
      <PixelChip
        text="PAK MULYADI • MENOLAK!"
        x={1025}
        y={438}
        centerX
        borderColor={PX.red}
        color={PX.red}
        fontSize={12}
      />

      <PixelBubble
        text="TERIMA = AKUI SALAH"
        x={700}
        y={86}
        maxW={380}
        tail="bottom-right"
        accent={PX.red}
        at={rejectAt}
      />
    </VignetteStage>
  );
};

export const B22_V5_TolakKemarau: React.FC = () => {
  const f = useCurrentFrame();
  const v5Start = fullLocalF('B22', 345.5);

  if (f < v5Start) {
    return (
      <AbsoluteFill>
        <LiveMapBg era="drought" zoomFrom={1.08} zoomTo={1.16} dim={0.18} dur={v5Start} />
        <PixelChip
          text="PANEN GAGAL SEPARUH"
          x={640}
          y={76}
          centerX
          borderColor={PX.red}
          color={PX.red}
          fontSize={14}
        />
      </AbsoluteFill>
    );
  }

  return (
    <Sequence from={v5Start} durationInFrames={DUR - v5Start}>
      <V5Phase vDur={DUR - v5Start} rejectAt={fullLocalF('B22', 349.26) - v5Start} />
    </Sequence>
  );
};
