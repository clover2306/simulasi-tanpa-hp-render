import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelMapBg} from '../components/PixelUI';

const BRICKS = ['POMPA', 'BIBIT', 'PELATIHAN', 'PENGGILINGAN', 'JALAN DAGANG'];

const M8Phase: React.FC<{mDur: number}> = ({mDur}) => {
  const mf = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chipS = spring({
    frame: Math.max(0, mf - 170),
    fps,
    config: {damping: 12, stiffness: 200},
  });

  const hazards = [
    {label: 'DADU', phase: 0, y: 180},
    {label: 'HUJAN', phase: 0.33, y: 310},
    {label: 'HOKI', phase: 0.66, y: 440},
  ];

  return (
    <AbsoluteFill>
      <PixelMapBg plate="y2" zoomFrom={1.0} zoomTo={1.04} dim={0.62} blurPx={3} dur={mDur} />

      <PixelChip
        text="M8 • TEMBOK LIMA LAPIS VS KEBERUNTUNGAN"
        x={640}
        y={72}
        centerX
        borderColor={PX.gold}
        fontSize={13}
      />

      {/* Left: 5 brick layers stacked */}
      <PixelCard x={110} y={136} w={460} h={420} borderColor={PX.gold} pad="22px 24px">
        <div style={{fontSize: 13, color: PX.gold, textAlign: 'center', marginBottom: 16}}>
          STRUKTUR LIMA LAPIS
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          {BRICKS.map((b, idx) => {
            const s = spring({
              frame: Math.max(0, mf - idx * 14),
              fps,
              config: {damping: 13, stiffness: 200},
            });
            return (
              <div
                key={b}
                style={{
                  transform: `translateX(${(1 - s) * -40}px)`,
                  opacity: Math.min(1, s * 1.4),
                  background: '#3B2D18',
                  border: `3px solid ${PX.gold}`,
                  padding: '12px 16px',
                  fontSize: 14,
                  color: PX.goldHi,
                  textAlign: 'center',
                }}
              >
                {b}
              </div>
            );
          })}
        </div>
      </PixelCard>

      {/* Right: Luck / Weather / Price bouncing off the wall */}
      <div style={{position: 'absolute', left: 600, top: 136, width: 570, height: 420}}>
        {hazards.map((hz) => {
          const cyc = ((mf / 75) + hz.phase) % 1;
          // Approaches wall (0..0.45), hits at x=40, bounces back right (0.45..1)
          const hit = cyc < 0.45 ? cyc / 0.45 : 1 - (cyc - 0.45) / 0.55;
          const hx = interpolate(hit, [0, 1], [420, 12]);
          const hy = hz.y - 136 - (cyc > 0.45 ? Math.sin((cyc - 0.45) * 6) * 32 : 0);
          return (
            <div
              key={hz.label}
              style={{
                position: 'absolute',
                left: hx,
                top: hy,
                background: '#2B1B18',
                border: `3px solid ${PX.red}`,
                padding: '14px 20px',
                fontSize: 13,
                color: PX.amber,
              }}
            >
              {hz.label}
            </div>
          );
        })}
      </div>

      {/* Bottom chip: BUKAN HOKI, TAPI STRUKTUR */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 574,
          translate: '-50% 0',
          transform: `scale(${mf >= 170 ? chipS : 0.85})`,
          opacity: mf >= 170 ? 1 : 0.4,
        }}
      >
        <PixelChip
          text="BUKAN HOKI, TAPI STRUKTUR"
          borderColor={PX.gold}
          bg="#261D10"
          color={PX.gold}
          fontSize={16}
        />
      </div>
    </AbsoluteFill>
  );
};

export const B33_SeratusKali_M8: React.FC = () => {
  const f = useCurrentFrame();

  const fillStart = fullLocalF('B33', 648.0);
  const fillEnd = fullLocalF('B33', 663.56);
  const m8Start = fullLocalF('B33', 670.84);
  const m8End = fullLocalF('B33', 680.4);

  if (f >= m8Start && f < m8End) {
    // M8 MG: Tembok Lima Lapis vs Keberuntungan (ZERO "100" or "0"!)
    return (
      <Sequence from={m8Start} durationInFrames={m8End - m8Start}>
        <M8Phase mDur={m8End - m8Start} />
      </Sequence>
    );
  }

  // 10x10 World Grid (without forbidden numbers in MG; conveys sweep cleanly)
  const filledCount = Math.round(
    interpolate(f, [fillStart, fillEnd], [0, 100], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#16151E'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 74,
          translate: '-50% 0',
          fontSize: 18,
          color: PX.gold,
          whiteSpace: 'nowrap',
        }}
      >
        SIMULASI DIULANG BERKALI-KALI
      </div>

      {/* 10x10 world grid (y: 122..534) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 122,
          translate: '-50% 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 38px)',
          gap: 6,
        }}
      >
        {Array.from({length: 100}, (_, i) => {
          const on = i < filledCount;
          return (
            <div
              key={i}
              style={{
                width: 38,
                height: 34,
                background: on ? PX.blue : '#22212E',
                border: `2px solid ${on ? PX.blueLight : '#444156'}`,
                boxShadow: on ? 'inset 0 2px 0 rgba(255,255,255,0.35)' : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Summary banner below grid (y: 546..630, well above y=660 caption zone) */}
      <PixelCard x={640} y={584} w={880} center borderColor={PX.gold} pad="14px 24px">
        <div style={{fontSize: 15, color: PX.gold, textAlign: 'center'}}>
          {filledCount >= 100
            ? 'KUBU VISIONER MENANG DI SETIAP DUNIA'
            : 'MENGUJI VARIASI CUACA, HAMA & HARGA...'}
        </div>
        <div style={{fontSize: 11, color: PX.blueLight, textAlign: 'center', marginTop: 10}}>
          {f >= m8End
            ? 'KEUNGGULAN STRUKTURAL • BUKAN SEKADAR KEBETULAN'
            : 'KUBU TRADISIONAL TIDAK PERNAH MEMBALIKKAN HASIL'}
        </div>
      </PixelCard>
    </AbsoluteFill>
  );
};
