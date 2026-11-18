import React, {useContext} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useCount} from '../lib/ui/ui';
import {localF} from '../demoPlan';
import {LiveMapContext} from '../components/LiveMapBg';
import {
  PX,
  PixelBoard,
  PixelCard,
  PixelChip,
  PixelMapBg,
  PixelSprite,
  PixelStamp,
} from '../components/PixelUI';

const DUR = 659; // 169.58 - 191.52s

export const B13_KontrasTanjungsari: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mapMode = useContext(LiveMapContext);

  const scoreStart = localF('B13', 177.58); // "Indeks kemakmuran tahun kedua: Sinarbaru 28, Tanjungsari 34"
  const stampAt = localF('B13', 185.24); // "kesimpulannya gampang: pengalaman menang..."
  const waitAt = localF('B13', 189.86); // "Tapi tunggu dulu."

  const sinScore = Math.round(useCount(scoreStart, 95, 28, 20));
  const tanScore = Math.round(useCount(scoreStart + 30, 95, 34, 20));

  const cardIn = spring({
    frame: Math.max(0, f - (scoreStart - 16)),
    fps,
    config: {damping: 14, stiffness: 170},
  });

  const fadeOut =
    mapMode === 'full'
      ? 1
      : interpolate(f, [DUR - 20, DUR], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: fadeOut}}>
        {/* Dry fields plate contrast */}
        <PixelMapBg
          plate="sawah_kering"
          zoomFrom={1.0}
          zoomTo={1.06}
          panX={[-14, 14]}
          dim={0.28}
          shimmer={false}
          dur={DUR}
        />

        {/* Top Tanjungsari header board */}
        <PixelBoard
          title="TANJUNGSARI • CARA LAMA"
          subtitle="TANPA ALAT BARU • TANPA DRAMA"
          x={640}
          y={76}
          w={560}
          accent={PX.green}
        />

        {/* Score Count-up Comparison Card (y: 186..476) */}
        {f >= scoreStart - 16 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: Math.min(1, cardIn * 1.4),
              transform: `scale(${interpolate(cardIn, [0, 1], [0.92, 1])})`,
            }}
          >
            <PixelCard x={180} y={184} w={920} h={286} borderColor={PX.gold} pad="24px 32px">
              <div style={{fontSize: 15, color: PX.goldHi, textAlign: 'center'}}>
                INDEKS KEMAKMURAN — TAHUN 2
              </div>

              {/* Sinarbaru Row */}
              <div style={{marginTop: 28, display: 'flex', alignItems: 'center', gap: 18}}>
                <PixelSprite src="kevin_walk_0.png" w={32} h={52} />
                <div style={{width: 210, fontSize: 14, color: PX.gold}}>SINARBARU</div>
                <div
                  style={{
                    flex: 1,
                    height: 30,
                    background: '#100E0C',
                    border: `2px solid ${PX.borderDark}`,
                  }}
                >
                  <div
                    style={{
                      width: `${sinScore * 2}%`,
                      height: '100%',
                      background: PX.gold,
                    }}
                  />
                </div>
                <div style={{width: 72, textAlign: 'right', fontSize: 22, color: PX.gold}}>
                  {sinScore}
                </div>
              </div>

              {/* Tanjungsari Row */}
              <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 18}}>
                <PixelSprite src="mulyadi_walk_0.png" w={32} h={52} />
                <div style={{width: 210, fontSize: 14, color: PX.green}}>TANJUNGSARI</div>
                <div
                  style={{
                    flex: 1,
                    height: 30,
                    background: '#100E0C',
                    border: `2px solid ${PX.borderDark}`,
                  }}
                >
                  <div
                    style={{
                      width: `${tanScore * 2}%`,
                      height: '100%',
                      background: PX.green,
                    }}
                  />
                </div>
                <div style={{width: 72, textAlign: 'right', fontSize: 22, color: PX.green}}>
                  {tanScore}
                </div>
              </div>
            </PixelCard>
          </div>
        ) : null}

        {/* Moment Stamp */}
        <PixelStamp
          text="PENGALAMAN MENANG?"
          x={640}
          y={534}
          at={stampAt}
          color={PX.green}
          rot={-3}
          fontSize={22}
        />

        {/* Suspense beat before segment boundary */}
        {f >= waitAt ? (
          <PixelChip
            text="TAPI TUNGGU DULU..."
            x={640}
            y={592}
            centerX
            borderColor={PX.gold}
            bg="#1E1812"
            color={PX.gold}
            fontSize={14}
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
