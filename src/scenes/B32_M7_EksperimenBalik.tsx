import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelMapBg, PixelSprite} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';

const DUR = 1364; // 601.84 - 647.30s

const LAYERS_FIVE = ['POMPA', 'BIBIT', 'PELATIHAN', 'PENGGILINGAN', 'JALAN DAGANG'];

const M7Phase: React.FC<{mDur: number}> = ({mDur}) => {
  const mf = useCurrentFrame();
  const branchP = interpolate(mf, [40, 260], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <PixelMapBg plate="y1" zoomFrom={1.0} zoomTo={1.04} dim={0.62} blurPx={3} dur={mDur} />

      <PixelChip
        text="M7 • SATU PERSIMPANGAN, DUA DUNIA"
        x={640}
        y={72}
        centerX
        borderColor={PX.gold}
        fontSize={13}
      />

      {/* Top Branch: POMPA DITOLAK LAMA */}
      <PixelCard x={84} y={134} w={1112} h={210} borderColor={PX.red} pad="18px 24px">
        <div style={{fontSize: 13, color: PX.red}}>
          JALAN A: POMPA DITOLAK LAMA
        </div>
        <div style={{marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', gap: 22}}>
            {[0, 1, 2, 3].map((i) => {
              const dark = branchP > 0.25 + i * 0.18;
              return (
                <div key={i} style={{opacity: dark ? 0.45 : 1}}>
                  <PixelSprite src={dark ? 'house_aband.png' : 'house_thatch.png'} w={76} h={72} />
                </div>
              );
            })}
          </div>
          <PixelChip
            text="DESA SEPI • EKSODUS"
            borderColor={PX.red}
            color={PX.red}
            fontSize={12}
          />
        </div>
      </PixelCard>

      {/* Bottom Branch: POMPA DITERIMA DI AWAL */}
      <PixelCard x={84} y={370} w={1112} h={254} borderColor={PX.green} pad="18px 24px">
        <div style={{fontSize: 13, color: PX.green}}>
          JALAN B: POMPA DITERIMA DI TAHUN PERTAMA
        </div>
        <div style={{marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', gap: 18}}>
            {[0, 1, 2, 3].map((i) => (
              <PixelSprite key={i} src="house_thatch.png" w={76} h={72} />
            ))}
          </div>
          <PixelChip
            text="DESA TETAP HIDUP!"
            borderColor={PX.green}
            color={PX.greenHi}
            fontSize={12}
          />
        </div>
        <div style={{marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `2px solid ${PX.borderDark}`, paddingTop: 14}}>
          <div style={{fontSize: 10, color: PX.amber}}>TANJUNGSARI: SATU IKON (POMPA)</div>
          <div style={{fontSize: 10, color: PX.gold}}>SINARBARU: LIMA LAPIS ({LAYERS_FIVE.join(' • ')})</div>
        </div>
      </PixelCard>
    </AbsoluteFill>
  );
};

export const B32_M7_EksperimenBalik: React.FC = () => {
  const f = useCurrentFrame();

  const m7Start = fullLocalF('B32', 604.5);
  const m7End = fullLocalF('B32', 620.6);
  const stillLoseAt = fullLocalF('B32', 625.0);

  if (f < m7Start) {
    return (
      <AbsoluteFill>
        <LiveMapBg era="y16" zoomFrom={1.0} zoomTo={1.08} dim={0.2} dur={m7Start} />
        <PixelChip
          text="EKSPERIMEN BALIK: BAGAIMANA KALAU..."
          x={640}
          y={76}
          centerX
          borderColor={PX.gold}
          fontSize={13}
        />
      </AbsoluteFill>
    );
  }

  if (f < m7End) {
    // M7 MG: Satu Persimpangan, Dua Dunia (no unauthorized numbers!)
    return (
      <Sequence from={m7Start} durationInFrames={m7End - m7Start}>
        <M7Phase mDur={m7End - m7Start} />
      </Sequence>
    );
  }

  // Counterfactual rerun live map + result card (all numbers strictly in HUD!)
  return (
    <Sequence from={m7End} durationInFrames={DUR - m7End}>
      <AbsoluteFill>
        <LiveMapBg era="cf" zoomFrom={1.0} zoomTo={1.06} dim={0.22} dur={DUR - m7End} />

        <PixelCard
          x={640}
          y={524}
          w={900}
          center
          borderColor={PX.green}
          bg="rgba(20, 18, 16, 0.94)"
          pad="18px 26px"
        >
          <div style={{fontSize: 15, color: PX.greenHi, textAlign: 'center'}}>
            TANPA EKSODUS • DESA TANJUNGSARI TETAP HIDUP
          </div>
          <div style={{fontSize: 11, color: PX.goldHi, textAlign: 'center', marginTop: 12}}>
            {f >= stillLoseAt
              ? 'MASIH KALAH — KARENA POMPA SAJA TANPA PELATIHAN, PENGGILINGAN & JALAN DAGANG'
              : 'ORANGNYA SAMA, CUACANYA SAMA — HASILNYA BERBEDA'}
          </div>
        </PixelCard>
      </AbsoluteFill>
    </Sequence>
  );
};
