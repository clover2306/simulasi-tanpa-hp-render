import React from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelBoard, PixelBubble, PixelChip, PixelSprite} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {VignetteStage} from '../components/VignetteStage';

const DUR = 371; // 254.02 - 266.40s

const V3Phase: React.FC<{vDur: number; bubbleAt: number}> = ({vDur, bubbleAt}) => {
  const vf = useCurrentFrame();
  const {fps} = useVideoConfig();

  const signDrop = spring({
    frame: Math.max(0, vf - 24),
    fps,
    config: {damping: 10, stiffness: 240, mass: 0.65},
  });
  const villagerStepBack = spring({
    frame: Math.max(0, vf - 36),
    fps,
    config: {damping: 14, stiffness: 170},
  });

  return (
    <VignetteStage dur={vDur} palette="day" river="normal" splitGrass>
      {/* Villager from Tanjungsari carrying modern hoe, stepping back */}
      <div
        style={{
          position: 'absolute',
          left: 240 - villagerStepBack * 70,
          top: 268,
        }}
      >
        <PixelSprite
          src="villager_yellow_walk_0.png"
          w={92}
          h={148}
          style={{filter: 'brightness(0.18) contrast(1.4)'}}
        />
      </div>
      <PixelChip
        text="WARGA TANJUNGSARI"
        x={250}
        y={438}
        centerX
        borderColor={PX.amber}
        color={PX.amber}
        fontSize={11}
      />

      {/* Prohibition signboard slammed into ground */}
      <div
        style={{
          position: 'absolute',
          left: 560,
          top: 230 + (1 - signDrop) * -120,
          opacity: Math.min(1, signDrop * 1.8),
        }}
      >
        <div
          style={{
            width: 12,
            height: 156,
            background: '#6B4423',
            border: '2px solid #000',
            margin: '0 auto',
          }}
        />
      </div>
      {vf >= 24 ? (
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - signDrop) * -40}px)`}}>
          <PixelBoard
            title="DILARANG BELI ALAT"
            subtitle="DARI SINARBARU"
            x={566}
            y={192}
            w={340}
            accent={PX.red}
          />
        </div>
      ) : null}

      {/* Big Pak Mulyadi blocking on right */}
      <div style={{position: 'absolute', left: 970, top: 118}}>
        <PixelSprite src="portrait_mulyadi_stern.png" w={150} h={310} flipX />
      </div>
      <PixelChip
        text="PAK MULYADI • MELARANG!"
        x={1045}
        y={438}
        centerX
        borderColor={PX.green}
        color={PX.greenHi}
        fontSize={12}
      />

      <PixelBubble
        text="TIDAK BUTUH BANTUAN ANAK KEMARIN SORE!"
        x={580}
        y={52}
        maxW={490}
        tail="bottom-right"
        at={bubbleAt}
      />
    </VignetteStage>
  );
};

export const B17_MapHidup_V3Larangan: React.FC = () => {
  const f = useCurrentFrame();
  const v3Start = fullLocalF('B17', 260.2);

  if (f >= v3Start) {
    return (
      <Sequence from={v3Start} durationInFrames={DUR - v3Start}>
        <V3Phase vDur={DUR - v3Start} bubbleAt={fullLocalF('B17', 263.4) - v3Start} />
      </Sequence>
    );
  }

  return (
    <AbsoluteFill>
      <LiveMapBg
        era="y6"
        zoomFrom={1.03}
        zoomTo={1.09}
        panX={[-20, 10]}
        dim={0.14}
        dur={v3Start}
        extraWalkers={[
          {
            id: 'trader_in',
            sprite: 'villager_blue',
            path: [[154, 396], [330, 396], [444, 396]],
            speed: 62,
            loopMode: 'once',
            label: 'PEDAGANG',
            labelColor: PX.gold,
          },
        ]}
      />
      <PixelChip
        text="TAHUN 6 • JALAN DAGANG & WARUNG BUKA"
        x={330}
        y={74}
        centerX
        borderColor={PX.gold}
        fontSize={13}
      />
    </AbsoluteFill>
  );
};
