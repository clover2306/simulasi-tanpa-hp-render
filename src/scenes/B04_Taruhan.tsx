import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PopIn, SlideIn} from '../lib/paper/kit';
import {localF} from '../demoPlan';
import {PX, PixelCard, PixelChip, PixelMapBg, PixelSprite} from '../components/PixelUI';

const DUR = 632; // 32.38 - 53.43s

export const B04_Taruhan: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const qAt = localF('B04', 37.2);
  const youngAt = localF('B04', 39.1);
  const oldAt = localF('B04', 41.3);
  const ctaAt = localF('B04', 43.3);
  const readyAt = localF('B04', 47.88);

  const pulse = 1 + 0.06 * Math.sin(f / 10);
  const walkIdx = Math.floor(f / 8) % 4;
  const cardIn = spring({frame: Math.max(0, f - 10), fps, config: {damping: 15, stiffness: 170}});

  return (
    <AbsoluteFill>
      {/* Floating slow pan across map */}
      <PixelMapBg
        plate="y1"
        zoomFrom={1.04}
        zoomTo={1.08}
        panX={[-16, 16]}
        panY={[-6, 6]}
        dim={0.32}
        dur={DUR}
      />

      {/* Main bet card (y: 92..512) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${interpolate(cardIn, [0, 1], [0.92, 1])})`,
          opacity: Math.min(1, cardIn * 1.4),
        }}
      >
        <PixelCard x={160} y={96} w={960} h={416} borderColor={PX.gold} pad="24px 32px">
          <div style={{textAlign: 'center'}}>
            <PixelChip
              text="TARUHAN SIMULASI • 20 TAHUN"
              borderColor={PX.blueLight}
              color={PX.blueLight}
              fontSize={12}
            />
          </div>

          <div
            style={{
              marginTop: 24,
              textAlign: 'center',
              fontSize: 26,
              color: PX.gold,
              lineHeight: 1.4,
              opacity: f >= qAt ? 1 : 0.45,
            }}
          >
            SIAPA YANG LEBIH MAJU?
          </div>

          {/* 0 - 0 score bar */}
          <div
            style={{
              marginTop: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              background: '#100E0C',
              border: `2px solid ${PX.borderDark}`,
              padding: '18px 24px',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 14, width: 340}}>
              <PixelSprite src={`kevin_walk_${walkIdx}.png`} w={38} h={62} />
              <div>
                <div style={{fontSize: 13, color: PX.gold}}>SINARBARU</div>
                <div style={{fontSize: 24, color: PX.white, marginTop: 8}}>0</div>
              </div>
            </div>

            <div
              style={{
                width: 64,
                height: 64,
                border: `3px solid ${PX.gold}`,
                background: '#221C14',
                display: 'grid',
                placeItems: 'center',
                fontSize: 26,
                color: PX.gold,
                transform: `scale(${pulse.toFixed(3)})`,
              }}
            >
              ?
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 14,
                width: 340,
                textAlign: 'right',
              }}
            >
              <div>
                <div style={{fontSize: 13, color: PX.green}}>TANJUNGSARI</div>
                <div style={{fontSize: 24, color: PX.white, marginTop: 8}}>0</div>
              </div>
              <PixelSprite src={`mulyadi_walk_${walkIdx}.png`} w={38} h={62} flipX />
            </div>
          </div>

          {/* Two matchup chips */}
          <div
            style={{
              marginTop: 26,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <div style={{width: '48%', opacity: f >= youngAt ? 1 : 0.15}}>
              <PixelChip
                text="26 THN • PENUH RENCANA"
                borderColor={PX.blueLight}
                color={PX.blueLight}
                fontSize={12}
                style={{width: '100%', textAlign: 'center', boxSizing: 'border-box'}}
              />
            </div>
            <div style={{width: '48%', opacity: f >= oldAt ? 1 : 0.15}}>
              <PixelChip
                text="70 THN • PENUH PENGALAMAN"
                borderColor={PX.amber}
                color={PX.amber}
                fontSize={12}
                style={{width: '100%', textAlign: 'center', boxSizing: 'border-box'}}
              />
            </div>
          </div>
        </PixelCard>
      </div>

      {/* Comment CTA bar (y: 540..600, safely above y=660 caption zone) */}
      {f >= ctaAt && f < readyAt ? (
        <PopIn at={ctaAt} seed="cta">
          <PixelChip
            text="TULIS TEBAKANMU DI KOMENTAR!"
            x={640}
            y={548}
            centerX
            borderColor={PX.gold}
            bg="#261D12"
            color={PX.gold}
            fontSize={16}
          />
        </PopIn>
      ) : null}

      {f >= readyAt ? (
        <SlideIn at={readyAt} dy={20} dur={12}>
          <PixelChip
            text="KITA MULAI DARI HARI PERTAMA"
            x={640}
            y={548}
            centerX
            borderColor={PX.green}
            bg="#142216"
            color={PX.greenHi}
            fontSize={15}
          />
        </SlideIn>
      ) : null}
    </AbsoluteFill>
  );
};
