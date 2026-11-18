import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {W, H} from '../lib/tokens';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';

const DUR = 462; // 695.58 - 710.96s

export const B34_JawabanUmur: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const answerAt = fullLocalF('B34', 706.5);

  const bgScale = interpolate(f, [0, DUR], [1.0, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardS = spring({
    frame: Math.max(0, f - answerAt),
    fps,
    config: {damping: 13, stiffness: 190},
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#1E1420'}}>
      <AbsoluteFill style={{transform: `scale(${bgScale.toFixed(4)})`}}>
        <Img
          src={staticFile('sprites/bg_sunset.png')}
          className="pixel-img"
          style={{width: W, height: H, objectFit: 'cover', imageRendering: 'pixelated'}}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: '#140E16', opacity: 0.25}} />

      <PixelChip
        text="KENAPA SELISIH UMURNYA JAUH?"
        x={640}
        y={74}
        centerX
        borderColor={PX.gold}
        fontSize={14}
      />

      {/* Left: Kevin 26 Tahun */}
      <div style={{position: 'absolute', left: 210, top: 150}}>
        <PixelSprite src="portrait_kevin_happy.png" w={156} h={322} />
      </div>
      <PixelChip text="26 TAHUN" x={288} y={488} centerX borderColor={PX.blueLight} color={PX.blueLight} fontSize={16} />

      {/* Center VS */}
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 290,
          translate: '-50% -50%',
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: PX.redDark,
          border: `4px solid ${PX.gold}`,
          display: 'grid',
          placeItems: 'center',
          fontSize: 24,
          color: PX.white,
        }}
      >
        VS
      </div>

      {/* Right: Mulyadi 70 Tahun */}
      <div style={{position: 'absolute', left: 914, top: 150}}>
        <PixelSprite src="portrait_mulyadi_stern.png" w={156} h={322} flipX />
      </div>
      <PixelChip text="70 TAHUN" x={992} y={488} centerX borderColor={PX.amber} color={PX.amber} fontSize={16} />

      {/* Answer Card */}
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 584,
          translate: '-50% -50%',
          transform: `scale(${f >= answerAt ? cardS : 0.92})`,
        }}
      >
        <PixelCard w={880} borderColor={PX.gold} pad="14px 24px">
          <div style={{fontSize: 13, color: PX.gold, textAlign: 'center'}}>
            {f >= answerAt
              ? 'SUPAYA CARA PIKIRNYA KELIHATAN JELAS — BUKAN ADU HOKI!'
              : 'KALAU HANYA BEDA SEDIKIT, HASILNYA HAMPIR SAMA...'}
          </div>
        </PixelCard>
      </div>
    </AbsoluteFill>
  );
};
