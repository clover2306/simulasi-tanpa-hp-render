import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SparkleBurst} from '../lib/paper/kit';
import {localF} from '../demoPlan';
import {PX, PixelCard, PixelChip, PixelMapBg, PixelSprite} from '../components/PixelUI';

const DUR = 264; // 131.86 - 140.66s

const SeedIcon: React.FC = () => (
  <svg width={56} height={56} viewBox="0 0 16 16">
    <rect x={7} y={7} width={2} height={7} fill={PX.green} />
    <rect x={3} y={4} width={4} height={3} fill={PX.greenHi} />
    <rect x={9} y={3} width={4} height={3} fill={PX.greenHi} />
    <rect x={4} y={13} width={8} height={2} fill="#8C6239" />
  </svg>
);

const ITEMS = [
  {id: 'pompa', label: 'POMPA AIR', sub: 'IRIGASI SAWAH', at: localF('B10', 136.2)},
  {id: 'bibit', label: 'BIBIT BARU', sub: 'BENIH UNGGUL', at: localF('B10', 138.0)},
  {id: 'latih', label: 'PELATIHAN', sub: 'SEMUA PETANI', at: localF('B10', 139.06)},
];

export const B10_M2_LumbungTerkuras: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Granary drains 100% -> 52% ("hampir setengah isi lumbung dalam sekali jalan")
  const drainStart = localF('B10', 133.5);
  const drainEnd = localF('B10', 136.2);
  const drainU = interpolate(f, [drainStart, drainEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const pct = Math.round(100 - 48 * drainU);
  const fillColor = pct > 70 ? PX.gold : PX.amber;

  return (
    <AbsoluteFill>
      <PixelMapBg plate="y1" zoomFrom={1.0} zoomTo={1.05} dim={0.55} blurPx={3} dur={DUR} />

      <PixelChip
        text="M2 • LUMBUNG TERKURAS JADI MODAL"
        x={640}
        y={74}
        centerX
        borderColor={PX.gold}
        fontSize={14}
      />

      {/* Left: Granary Tank */}
      <PixelCard x={84} y={142} w={450} h={480} borderColor={PX.gold} pad="24px 28px">
        <div style={{fontSize: 16, color: PX.gold, textAlign: 'center'}}>LUMBUNG SINARBARU</div>
        <div style={{fontSize: 11, color: PX.white, textAlign: 'center', marginTop: 10}}>
          ISI CADANGAN MODAL
        </div>

        {/* Pixel Granary Gauge */}
        <div
          style={{
            position: 'relative',
            margin: '26px auto 0',
            width: 220,
            height: 260,
            background: '#100E0C',
            border: `4px solid ${PX.borderDark}`,
            boxShadow: 'inset 0 0 0 3px #000',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: `${pct}%`,
              background: fillColor,
              borderTop: '4px solid #FFF8DC',
            }}
          />
          {/* Halfway marker */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: 3,
              background: PX.red,
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              fontSize: 32,
              color: PX.white,
              textShadow: '3px 3px 0 #000',
            }}
          >
            {pct}%
          </div>
        </div>

        <div style={{fontSize: 11, color: PX.amber, textAlign: 'center', marginTop: 22}}>
          {pct <= 60 ? 'HAMPIR SETENGAH TERPAKAI!' : 'MODAL AWAL SIAP'}
        </div>
      </PixelCard>

      {/* Right: 3 investment items springing out of the granary */}
      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 142,
          width: 596,
          height: 480,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {ITEMS.map((it, idx) => {
          const s = spring({
            frame: Math.max(0, f - it.at),
            fps,
            config: {damping: 11, stiffness: 200, mass: 0.7},
          });
          const visible = f >= it.at;
          const dx = visible ? interpolate(s, [0, 1], [-180, 0]) : -180;
          const arcY = visible ? -Math.sin(Math.min(1, s) * Math.PI) * 36 : 0;

          return (
            <div
              key={it.id}
              style={{
                opacity: visible ? Math.min(1, s * 1.4) : 0,
                transform: `translate(${dx.toFixed(1)}px, ${arcY.toFixed(1)}px) scale(${visible ? 0.7 + 0.3 * s : 0.7})`,
              }}
            >
              <PixelCard w={596} h={140} borderColor={PX.blueLight} pad="18px 24px">
                <div style={{display: 'flex', alignItems: 'center', gap: 24, height: '100%'}}>
                  <div
                    style={{
                      width: 92,
                      height: 92,
                      background: '#222A33',
                      border: `2px solid ${PX.blueLight}`,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {idx === 0 ? (
                      <PixelSprite src="pump.png" w={72} h={65} />
                    ) : idx === 1 ? (
                      <SeedIcon />
                    ) : (
                      <PixelSprite src="villager_blue_walk_0.png" w={44} h={72} />
                    )}
                  </div>
                  <div>
                    <div style={{fontSize: 19, color: PX.gold}}>{it.label}</div>
                    <div style={{fontSize: 12, color: PX.blueLight, marginTop: 12}}>{it.sub}</div>
                  </div>
                </div>
              </PixelCard>
            </div>
          );
        })}
      </div>

      {ITEMS.map((it, idx) => (
        <SparkleBurst key={it.id} at={it.at + 4} x={646} y={212 + idx * 170} seed={`m2${it.id}`} />
      ))}
    </AbsoluteFill>
  );
};
