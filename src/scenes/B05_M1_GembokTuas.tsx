import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SlideIn, SparkleBurst} from '../lib/paper/kit';
import {localF} from '../demoPlan';
import {PX, PixelCard, PixelChip, PixelMapBg, PixelSprite} from '../components/PixelUI';

const DUR = 591; // 53.43 - 73.12s

const LOCKS = [
  {id: 'warga', label: 'WARGA', value: '100 vs 100', at: localF('B05', 58.42)},
  {id: 'lahan', label: 'LAHAN', value: 'SAMA LUAS', at: localF('B05', 60.76)},
  {id: 'sungai', label: 'SUNGAI', value: 'SAMA JERNIH', at: localF('B05', 62.3)},
  {id: 'lumbung', label: 'LUMBUNG', value: 'SAMA PENUH', at: localF('B05', 63.8)},
  {id: 'cuaca', label: 'CUACA', value: 'BARENGAN', at: localF('B05', 65.56)},
];

const PadlockIcon: React.FC<{locked: number}> = ({locked}) => {
  const shackleDrop = interpolate(locked, [0, 1], [-10, 0]);
  return (
    <svg width={52} height={58} viewBox="0 0 52 58" style={{display: 'block', margin: '0 auto'}}>
      {/* Shackle */}
      <path
        d="M14 26 V16 A12 12 0 0 1 38 16 V26"
        fill="none"
        stroke={locked > 0.5 ? PX.gold : '#88827A'}
        strokeWidth={6}
        transform={`translate(0 ${shackleDrop.toFixed(1)})`}
      />
      {/* Body */}
      <rect
        x={6}
        y={24}
        width={40}
        height={30}
        fill={locked > 0.5 ? '#D8A236' : '#4A4640'}
        stroke="#141210"
        strokeWidth={3}
      />
      <rect x={10} y={28} width={32} height={4} fill={locked > 0.5 ? '#FFF0B4' : '#6A645C'} />
      {/* Keyhole */}
      <circle cx={26} cy={38} r={4} fill="#141210" />
      <rect x={24} y={40} width={4} height={8} fill="#141210" />
    </svg>
  );
};

const LeverSwitch: React.FC<{
  name: string;
  sprite: string;
  target: 'ON' | 'OFF';
  flipAt: number;
  accent: string;
}> = ({name, sprite, target, flipAt, accent}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: Math.max(0, f - flipAt),
    fps,
    config: {damping: 10, stiffness: 200, mass: 0.7},
  });
  const active = f >= flipAt;
  const angle = target === 'ON' ? interpolate(s, [0, 1], [0, -34]) : interpolate(s, [0, 1], [0, 34]);
  const isOn = target === 'ON';

  return (
    <PixelCard w={470} h={290} borderColor={active ? accent : PX.borderDark} pad="18px 22px">
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <PixelSprite src={sprite} w={40} h={64} />
          <div>
            <div style={{fontSize: 16, color: accent}}>{name}</div>
            <div style={{fontSize: 10, color: PX.goldHi, marginTop: 6}}>
              {isOn ? 'TEKNOLOGI • RENCANA • BELAJAR' : 'TOLAK PERUBAHAN'}
            </div>
          </div>
        </div>
      </div>

      {/* Lever mechanism */}
      <div
        style={{
          marginTop: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          background: '#100E0C',
          border: `2px solid ${PX.borderDark}`,
          padding: '18px 20px',
        }}
      >
        <div style={{position: 'relative', width: 90, height: 100}}>
          {/* Base plate */}
          <div
            style={{
              position: 'absolute',
              left: 20,
              bottom: 6,
              width: 50,
              height: 22,
              background: '#5A554E',
              border: '3px solid #000',
            }}
          />
          {/* Lever arm */}
          <div
            style={{
              position: 'absolute',
              left: 41,
              bottom: 24,
              width: 8,
              height: 62,
              background: '#C8C2B8',
              border: '2px solid #000',
              transformOrigin: '50% 100%',
              transform: `rotate(${angle.toFixed(1)}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -10,
                top: -14,
                width: 24,
                height: 24,
                background: active ? (isOn ? PX.greenDark : PX.redDark) : '#7C766E',
                border: '3px solid #000',
              }}
            />
          </div>
        </div>

        <div style={{textAlign: 'left'}}>
          <div
            style={{
              fontSize: 28,
              color: active ? (isOn ? PX.green : PX.red) : '#78726A',
            }}
          >
            {active ? target : '---'}
          </div>
          <div style={{fontSize: 11, color: PX.goldHi, marginTop: 10}}>
            {active ? (isOn ? 'UBAH 3 HAL!' : 'CARA LELUHUR') : 'MENUNGGU...'}
          </div>
        </div>
      </div>
    </PixelCard>
  );
};

export const B05_M1_GembokTuas: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const leverShowAt = localF('B05', 67.9); // "Satu-satunya yang beda adalah pemimpinnya"
  const kevinFlipAt = localF('B05', 70.22); // "Dan pemimpin itu..."
  const mulyadiFlipAt = localF('B05', 71.28); // "...mengubah tiga hal"

  const compress = interpolate(f, [leverShowAt, leverShowAt + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lockRowY = interpolate(compress, [0, 1], [190, 128]);
  const lockRowScale = interpolate(compress, [0, 1], [1, 0.72]);

  return (
    <AbsoluteFill>
      <PixelMapBg plate="y1" zoomFrom={1.0} zoomTo={1.04} dim={0.55} blurPx={3} dur={DUR} />

      <PixelChip
        text="ATURAN SIMULASI: 5 VARIABEL DIKUNCI"
        x={640}
        y={74}
        centerX
        borderColor={PX.gold}
        fontSize={14}
      />

      {/* 5 Padlock Cards */}
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: lockRowY,
          width: 1172,
          display: 'flex',
          justifyContent: 'space-between',
          transform: `scale(${lockRowScale.toFixed(4)})`,
          transformOrigin: '50% 0%',
        }}
      >
        {LOCKS.map((lk, idx) => {
          const appearAt = 24 + idx * 12;
          const lockS = spring({
            frame: Math.max(0, f - lk.at),
            fps,
            config: {damping: 12, stiffness: 220, mass: 0.6},
          });
          const cardIn = spring({
            frame: Math.max(0, f - appearAt),
            fps,
            config: {damping: 15, stiffness: 180},
          });
          const isLocked = f >= lk.at;
          return (
            <div
              key={lk.id}
              style={{
                width: 220,
                opacity: f >= appearAt ? Math.min(1, cardIn * 1.4) : 0,
                transform: `translateY(${(1 - cardIn) * 24}px)`,
              }}
            >
              <PixelCard
                w={220}
                h={226}
                borderColor={isLocked ? PX.gold : PX.borderDark}
                pad="18px 12px"
                style={{textAlign: 'center'}}
              >
                <PadlockIcon locked={isLocked ? lockS : 0} />
                <div style={{fontSize: 15, color: PX.gold, marginTop: 18}}>{lk.label}</div>
                <div style={{fontSize: 10, color: PX.white, marginTop: 10}}>{lk.value}</div>
                <div
                  style={{
                    marginTop: 16,
                    display: 'inline-block',
                    padding: '5px 8px',
                    fontSize: 9,
                    background: isLocked ? '#332610' : '#24211E',
                    border: `2px solid ${isLocked ? PX.gold : '#4A4640'}`,
                    color: isLocked ? PX.gold : '#88827A',
                  }}
                >
                  {isLocked ? 'TERKUNCI' : 'SIAP'}
                </div>
              </PixelCard>
            </div>
          );
        })}
      </div>

      {/* Sparkle bursts when each lock snaps */}
      {LOCKS.map((lk, idx) => (
        <SparkleBurst
          key={lk.id}
          at={lk.at}
          x={54 + idx * 238 + 110}
          y={lockRowY + 40}
          seed={`lk${lk.id}`}
          spread={0.75}
        />
      ))}

      {/* Panel Tuas Pemimpin */}
      {f >= leverShowAt ? (
        <SlideIn at={leverShowAt} dy={70} dur={14}>
          <div
            style={{
              position: 'absolute',
              left: 110,
              top: 312,
              width: 1060,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <LeverSwitch
              name="TUAS KEVIN"
              sprite="kevin_walk_0.png"
              target="ON"
              flipAt={kevinFlipAt}
              accent={PX.gold}
            />
            <LeverSwitch
              name="TUAS MULYADI"
              sprite="mulyadi_walk_0.png"
              target="OFF"
              flipAt={mulyadiFlipAt}
              accent={PX.green}
            />
          </div>
        </SlideIn>
      ) : null}
    </AbsoluteFill>
  );
};
