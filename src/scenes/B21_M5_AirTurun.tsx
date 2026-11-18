import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelMapBg, PixelSprite} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';

const DUR = 402; // 330.24 - 343.62s

const M5Phase: React.FC<{mDur: number}> = ({mDur}) => {
  const mf = useCurrentFrame();

  // Water drops to 50% of cross-section
  const waterPct = interpolate(mf, [18, 95], [96, 48], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const pumpPhase = (mf % 24) / 24;

  return (
    <AbsoluteFill>
      <PixelMapBg plate="drought" zoomFrom={1.0} zoomTo={1.04} dim={0.58} blurPx={3} dur={mDur} shimmer={false} />

      <PixelChip
        text="M5 • AIR TURUN, SIAPA MASIH PUNYA SUMBER"
        x={640}
        y={72}
        centerX
        borderColor={PX.gold}
        fontSize={13}
      />

      <PixelCard x={84} y={134} w={1112} h={494} borderColor={PX.gold} pad="22px 28px">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', height: '100%', gap: 24}}>
          {/* Left: SINARBARU (Pump submerged -> water to ditch -> green field) */}
          <div
            style={{
              flex: 1,
              background: '#172216',
              border: `2px solid ${PX.gold}`,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{fontSize: 13, color: PX.gold}}>SINARBARU</div>
              <PixelSprite src="pump.png" w={68} h={62} />
            </div>

            {/* Irrigation stream */}
            <div style={{position: 'relative', height: 140, background: '#1F3A1D', border: '2px solid #3C6B32', overflow: 'hidden'}}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 32,
                  height: 18,
                  background: '#3B95DB',
                }}
              />
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    right: ((pumpPhase + i * 0.25) % 1) * 320,
                    top: 38,
                    width: 24,
                    height: 6,
                    background: '#BCE8FF',
                  }}
                />
              ))}
              {/* Green thriving crops */}
              <div style={{position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', justifyContent: 'space-around'}}>
                {[0, 1, 2, 3, 4].map((c) => (
                  <div key={c} style={{width: 22, height: 42, background: '#78D458', border: '2px solid #2A5C1E'}} />
                ))}
              </div>
            </div>

            {/* Clean bottom signboard */}
            <div
              style={{
                background: '#2E2314',
                border: `2px solid ${PX.gold}`,
                padding: '10px 12px',
                textAlign: 'center',
                fontSize: 11,
                color: PX.gold,
              }}
            >
              SINARBARU: HUJAN + SUNGAI
            </div>
          </div>

          {/* Center: River cross-section */}
          <div style={{width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 11, color: PX.blueLight, marginBottom: 12}}>SUNGAI</div>
            <div
              style={{
                position: 'relative',
                width: 170,
                height: 290,
                background: '#2B2218',
                border: '4px solid #6F583B',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: `${waterPct}%`,
                  background: '#2D7EC4',
                  borderTop: '4px solid #9AD4FF',
                }}
              />
              {/* Half mark visual tick (no number) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '52%',
                  borderTop: '3px dashed #FFDC78',
                }}
              />
              {/* Intake pipe reaching down to bottom on left */}
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 32,
                  width: 14,
                  height: 215,
                  background: '#8E98A4',
                  border: '2px solid #1C2026',
                }}
              />
            </div>
            <div style={{fontSize: 10, color: PX.amber, marginTop: 12}}>MENYUSUT</div>
          </div>

          {/* Right: TANJUNGSARI (Empty cloud, cracked soil) */}
          <div
            style={{
              flex: 1,
              background: '#261D14',
              border: `2px solid ${PX.red}`,
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{fontSize: 13, color: PX.amber}}>TANJUNGSARI</div>
              {/* Empty dry cloud */}
              <div style={{width: 64, height: 28, background: '#78726B', border: '2px solid #2A2622'}} />
            </div>

            <div style={{position: 'relative', height: 140, background: '#947744', border: '2px solid #5C4622'}}>
              {/* Cracks */}
              <svg width="100%" height="100%" viewBox="0 0 300 140">
                <path d="M30 20 L70 58 L52 96 L90 128" fill="none" stroke="#4D3918" strokeWidth={4} />
                <path d="M160 14 L145 55 L182 88 L170 130" fill="none" stroke="#4D3918" strokeWidth={4} />
                <path d="M240 28 L220 72 L255 110" fill="none" stroke="#4D3918" strokeWidth={4} />
              </svg>
            </div>

            <div
              style={{
                background: '#2B1814',
                border: `2px solid ${PX.red}`,
                padding: '10px 12px',
                textAlign: 'center',
                fontSize: 11,
                color: PX.red,
              }}
            >
              TANJUNGSARI: HUJAN SAJA
            </div>
          </div>
        </div>
      </PixelCard>
    </AbsoluteFill>
  );
};

export const B21_M5_AirTurun: React.FC = () => {
  const f = useCurrentFrame();
  const m5Start = fullLocalF('B21', 333.46); // "Sungai menyusut sampai setengah"

  if (f < m5Start) {
    return (
      <AbsoluteFill>
        <LiveMapBg era="drought" zoomFrom={1.02} zoomTo={1.14} panX={[0, -40]} dim={0.18} dur={m5Start} />
        <PixelChip
          text="KEMARAU PANJANG!"
          x={640}
          y={76}
          centerX
          borderColor={PX.red}
          color={PX.red}
          fontSize={16}
        />
      </AbsoluteFill>
    );
  }

  return (
    <Sequence from={m5Start} durationInFrames={DUR - m5Start}>
      <M5Phase mDur={DUR - m5Start} />
    </Sequence>
  );
};
