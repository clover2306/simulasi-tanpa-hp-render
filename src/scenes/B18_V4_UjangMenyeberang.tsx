import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelBoard, PixelBubble, PixelChip, PixelSprite} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {VignetteStage} from '../components/VignetteStage';

const DUR = 417; // 266.40 - 280.30s

const V4Phase: React.FC<{vDur: number; bubbleAt: number}> = ({vDur, bubbleAt}) => {
  const vf = useCurrentFrame();

  // Ujang walks from right (x=770) to center stepping stones, pauses, glances back, steps left to Sinarbaru (330)
  const walkU = interpolate(vf, [24, 90, 140, 210], [0, 0.42, 0.42, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const ujangX = interpolate(walkU, [0, 1], [770, 330]);
  const glancingBack = vf >= 92 && vf <= 136;
  const hasWrench = walkU >= 0.85;
  const bob = walkU > 0 && walkU < 1 && !glancingBack ? Math.sin(vf * 0.45) * 4 : 0;

  return (
    <VignetteStage dur={vDur} palette="day" river="normal" splitGrass>
      {/* Left background: Sinarbaru signboard + pulsing pump */}
      <PixelBoard title="SINARBARU" x={180} y={240} w={210} accent={PX.gold} />
      <div style={{position: 'absolute', left: 120, top: 304 + (Math.floor(vf / 6) % 2) * -2}}>
        <PixelSprite src="pump.png" w={120} h={110} />
      </div>

      {/* Right background: Tanjungsari signboard + cottage */}
      <PixelBoard title="TANJUNGSARI" x={1100} y={240} w={230} accent={PX.green} />
      <div style={{position: 'absolute', left: 1030, top: 298}}>
        <PixelSprite src="house_thatch.png" w={136} h={128} />
      </div>

      {/* Stepping stones across center */}
      {[480, 560, 640, 720].map((sx) => (
        <div
          key={sx}
          style={{
            position: 'absolute',
            left: sx,
            top: 416,
            width: 58,
            height: 18,
            background: '#9B968E',
            border: '3px solid #2A2622',
          }}
        />
      ))}

      {/* ONE SINGLE Ujang (never two Ujangs!) */}
      <div style={{position: 'absolute', left: ujangX, top: 118 + bob}}>
        <PixelSprite
          src={hasWrench ? 'portrait_ujang_wrench.png' : 'portrait_ujang_hoe.png'}
          w={150}
          h={310}
          flipX={!glancingBack}
        />
      </div>
      <PixelChip
        text="UJANG • MENYEBERANG!"
        x={ujangX + 75}
        y={438}
        centerX
        borderColor={hasWrench ? PX.gold : PX.amber}
        fontSize={12}
      />

      {/* Thought bubble: "BUKAN KARENA BENCI" */}
      <PixelBubble
        text="BUKAN KARENA BENCI..."
        x={420}
        y={68}
        maxW={420}
        tail="bottom-center"
        accent={PX.ink}
        at={bubbleAt}
      />
    </VignetteStage>
  );
};

export const B18_V4_UjangMenyeberang: React.FC = () => {
  const f = useCurrentFrame();
  const v4Start = fullLocalF('B18', 272.06);

  if (f >= v4Start) {
    return (
      <Sequence from={v4Start} durationInFrames={DUR - v4Start}>
        <V4Phase vDur={DUR - v4Start} bubbleAt={fullLocalF('B18', 274.5) - v4Start} />
      </Sequence>
    );
  }

  // Phase A: Live map with camera tracking Ujang heading toward the bridge
  const mapPanX = interpolate(f, [0, v4Start], [-80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <LiveMapBg
        era="y6"
        zoomFrom={1.18}
        zoomTo={1.32}
        panX={[mapPanX, mapPanX]}
        dim={0.12}
        dur={v4Start}
        hideIds={['ujang']}
        extraWalkers={[
          {
            id: 'ujang_hero',
            sprite: 'ujang',
            path: [[880, 316], [780, 316], [780, 396], [680, 396], [666, 368]],
            speed: 55,
            loopMode: 'once',
            label: 'UJANG',
            labelColor: PX.amber,
          },
        ]}
      />
      <PixelChip
        text="UJANG • PETANI TANJUNGSARI"
        x={640}
        y={74}
        centerX
        borderColor={PX.amber}
        fontSize={13}
      />
    </AbsoluteFill>
  );
};
