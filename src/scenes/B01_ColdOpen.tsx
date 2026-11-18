import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PopIn, SlideIn} from '../lib/paper/kit';
import {localF} from '../demoPlan';
import {PX, PixelBoard, PixelCard, PixelChip, PixelMapBg, PixelSprite} from '../components/PixelUI';

const DUR = 384; // 0.00 - 12.80s

export const B01_ColdOpen: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Title card stays 0..115f, then fades out cleanly as variable chips pop in
  const titleOut = interpolate(f, [90, 114], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Walk cycle on the map (calm 12fps step)
  const walkIdx = Math.floor(f / 8) % 4;

  // Variable chips synced to transcript:
  // 3.22s (97f): 100 warga | 4.42s (133f): sawah | 5.92s (178f): sungai | 7.20s (216f): lumbung
  const chips = [
    {text: '100 WARGA vs 100 WARGA', at: localF('B01', 3.0), x: 340, y: 120},
    {text: 'SAWAH SAMA LUAS', at: localF('B01', 4.3), x: 940, y: 120},
    {text: 'SUNGAI SAMA JERNIH', at: localF('B01', 5.8), x: 340, y: 550},
    {text: 'LUMBUNG SAMA PENUH', at: localF('B01', 7.1), x: 940, y: 550},
  ];

  // Spotlight on leaders at 8.80s (264f) "Bedanya cuma satu: orang yang berdiri di depan"
  const spotlightAt = localF('B01', 8.8);
  const spotSpring = spring({
    frame: Math.max(0, f - spotlightAt),
    fps,
    config: {damping: 14, stiffness: 180},
  });

  return (
    <AbsoluteFill>
      <PixelMapBg plate="y1" zoomFrom={1.0} zoomTo={1.09} dim={0.14} dur={DUR} />

      {/* Title card at cold open */}
      {titleOut > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: titleOut,
            pointerEvents: 'none',
          }}
        >
          <PopIn at={2} seed="coldtitle">
            <PixelCard
              x={640}
              y={340}
              w={820}
              center
              borderColor={PX.gold}
              bg="rgba(16, 14, 12, 0.94)"
              pad="28px 34px"
            >
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24}}>
                <PixelSprite src={`kevin_walk_${walkIdx}.png`} w={48} h={78} />
                <div style={{textAlign: 'center', flex: 1}}>
                  <div style={{fontSize: 28, color: PX.gold, lineHeight: 1.35}}>
                    SIMULASI 20 TAHUN!
                  </div>
                  <div style={{fontSize: 13, color: PX.white, marginTop: 16, lineHeight: 1.6}}>
                    DESA DIPIMPIN ANAK MUDA VS ORANG TUA
                  </div>
                </div>
                <PixelSprite src={`mulyadi_walk_${walkIdx}.png`} w={48} h={78} flipX />
              </div>
            </PixelCard>
          </PopIn>
        </div>
      ) : null}

      {/* 4 equal variable chips */}
      {chips.map((ch) =>
        f >= ch.at ? (
          <PopIn key={ch.text} at={ch.at} seed={ch.text} origin={`${ch.x}px ${ch.y}px`}>
            <PixelChip
              text={ch.text}
              x={ch.x}
              y={ch.y}
              centerX
              borderColor={PX.gold}
              fontSize={13}
            />
          </PopIn>
        ) : null,
      )}

      {/* Leader spotlight boards at 8.80s */}
      {f >= spotlightAt ? (
        <>
          <SlideIn at={spotlightAt} dx={-40} dur={12}>
            <PixelBoard
              title="SINARBARU"
              subtitle="PEMIMPIN: KEVIN (26)"
              x={310}
              y={240}
              w={320}
              accent={PX.gold}
            />
          </SlideIn>
          <SlideIn at={spotlightAt + 10} dx={40} dur={12}>
            <PixelBoard
              title="TANJUNGSARI"
              subtitle="PEMIMPIN: MULYADI (70)"
              x={970}
              y={240}
              w={340}
              accent={PX.green}
            />
          </SlideIn>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 390,
              translate: '-50% 0',
              transform: `scale(${spotSpring})`,
            }}
          >
            <PixelChip
              text="BEDANYA CUMA SATU: PEMIMPINNYA"
              borderColor={PX.white}
              color={PX.white}
              fontSize={13}
            />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
