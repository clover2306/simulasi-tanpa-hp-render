import React from 'react';
import {useCurrentFrame} from 'remotion';
import {W, H} from '../lib/tokens';
import {PIXEL_FONT} from '../pixelFont';
import {PX} from '../components/PixelUI';
import {hpHudStateAt} from './plan';

export const HP_HUD_H = 52;
export const HP_SAFE_BOTTOM = 656; // bottom 64px (656..720) kept clear for captions

/**
 * Solid uninterrupted parallel-world divider ("GARIS/SEKAT TEGAS, BUKAN SUNGAI").
 * Never crossed, never gapped.
 */
export const SekatBar: React.FC<{x?: number; top?: number; height?: number}> = ({
  x = W / 2,
  top = 0,
  height = H,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 5,
      top,
      width: 10,
      height,
      background: '#12100E',
      borderLeft: `2px solid ${PX.goldShadow}`,
      borderRight: `2px solid #3C5E7E`,
      boxSizing: 'border-box',
      pointerEvents: 'none',
      zIndex: 35,
    }}
  />
);

export type DimensionKey = 'belajar' | 'usaha' | 'kesehatan' | 'hubungan';

const DIM_META: Array<{key: DimensionKey; label: string}> = [
  {key: 'belajar', label: 'BELAJAR'},
  {key: 'usaha', label: 'USAHA'},
  {key: 'kesehatan', label: 'KESEHATAN'},
  {key: 'hubungan', label: 'HUBUNGAN'},
];

const DimPixelGlyph: React.FC<{kind: DimensionKey; color: string; cracked?: boolean}> = ({
  kind,
  color,
  cracked = false,
}) => {
  if (kind === 'belajar') {
    // Open pixel book
    return (
      <svg width={22} height={18} viewBox="0 0 11 9" style={{imageRendering: 'pixelated'}}>
        <rect x={0} y={1} width={5} height={7} fill={color} />
        <rect x={6} y={1} width={5} height={7} fill={color} />
        <rect x={5} y={2} width={1} height={6} fill="#141210" />
        <rect x={1} y={2} width={3} height={1} fill="#141210" />
        <rect x={7} y={2} width={3} height={1} fill="#141210" />
      </svg>
    );
  }
  if (kind === 'usaha') {
    // Market awning / stall
    return (
      <svg width={22} height={18} viewBox="0 0 11 9" style={{imageRendering: 'pixelated'}}>
        <rect x={0} y={0} width={11} height={3} fill={color} />
        <rect x={1} y={3} width={1} height={5} fill={color} />
        <rect x={9} y={3} width={1} height={5} fill={color} />
        <rect x={1} y={6} width={9} height={3} fill={color} />
      </svg>
    );
  }
  if (kind === 'kesehatan') {
    // Pixel cross / vitality
    return (
      <svg width={22} height={18} viewBox="0 0 11 9" style={{imageRendering: 'pixelated'}}>
        <rect x={4} y={0} width={3} height={9} fill={color} />
        <rect x={1} y={3} width={9} height={3} fill={color} />
      </svg>
    );
  }
  // hubungan: two pixel figures side by side (cracked when trust collapses)
  return (
    <svg width={24} height={18} viewBox="0 0 12 9" style={{imageRendering: 'pixelated'}}>
      <rect x={1} y={0} width={3} height={3} fill={color} />
      <rect x={0} y={4} width={5} height={5} fill={color} />
      <rect x={8} y={0} width={3} height={3} fill={color} />
      <rect x={7} y={4} width={5} height={5} fill={color} />
      {cracked ? (
        <path d="M6 0 L5 3 L7 5 L5 9" stroke={PX.red} strokeWidth={1.4} fill="none" />
      ) : null}
    </svg>
  );
};

/**
 * Four dimension icons strictly functioning as LABELS (never bars, scales, or numbers — Pagar 3 & 7).
 */
export const DimensionLabelsBar: React.FC<{
  y?: number;
  glowK?: DimensionKey[];
  glowM?: DimensionKey[];
  crackedHubungan?: boolean;
  compact?: boolean;
}> = ({y = 92, glowK = [], glowM = [], crackedHubungan = false, compact = false}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: y,
      translate: '-50% 0',
      display: 'flex',
      gap: compact ? 12 : 20,
      zIndex: 42,
      pointerEvents: 'none',
    }}
  >
    {DIM_META.map((d) => {
      const isK = glowK.includes(d.key);
      const isM = glowM.includes(d.key);
      const isCracked = d.key === 'hubungan' && crackedHubungan;
      const border = isCracked
        ? PX.red
        : isK
          ? PX.gold
          : isM
            ? PX.blueLight
            : '#585046';
      const color = isCracked
        ? PX.red
        : isK
          ? PX.goldHi
          : isM
            ? '#D6EEFF'
            : '#C8C0B4';
      const glow = isK
        ? '0 0 0 3px rgba(255,220,120,0.38), 4px 4px 0 rgba(0,0,0,0.7)'
        : isM
          ? '0 0 0 3px rgba(140,200,255,0.38), 4px 4px 0 rgba(0,0,0,0.7)'
          : '4px 4px 0 rgba(0,0,0,0.65)';
      return (
        <div
          key={d.key}
          style={{
            background: isK ? '#2B2312' : isM ? '#142334' : 'rgba(20, 18, 16, 0.94)',
            border: `3px solid ${border}`,
            boxShadow: glow,
            padding: compact ? '8px 12px' : '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: PIXEL_FONT,
            fontSize: compact ? 10 : 12,
            color,
          }}
        >
          <DimPixelGlyph kind={d.key} color={color} cracked={isCracked} />
          <div>
            <div>{d.label}</div>
            {isK ? (
              <div style={{fontSize: 8, color: PX.gold, marginTop: 5}}>&gt; KERTAJAYA</div>
            ) : isM ? (
              <div style={{fontSize: 8, color: PX.blueLight, marginTop: 5}}>&gt; MEKARSARI</div>
            ) : isCracked ? (
              <div style={{fontSize: 8, color: PX.red, marginTop: 5}}>X RETAK</div>
            ) : null}
          </div>
        </div>
      );
    })}
  </div>
);

/**
 * Top Global HUD for Desa Tanpa HP vs Desa Bebas HP.
 * Zero score bars, zero gauges, zero score before Y2 checkpoint.
 */
export const HpGlobalHud: React.FC = () => {
  const gf = useCurrentFrame();
  const {yearLabel, heldScore, sealedQuestion, kertajayaRerunHp, hudOpacity} = hpHudStateAt(gf);
  if (hudOpacity <= 0) return null;

  const kLeads = heldScore ? heldScore.k > heldScore.m : false;
  const mLeads = heldScore ? heldScore.m > heldScore.k : false;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: W,
        height: HP_HUD_H,
        opacity: hudOpacity,
        pointerEvents: 'none',
        fontFamily: PIXEL_FONT,
        zIndex: 60,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#141210',
          borderBottom: '3px solid #2E2822',
          boxShadow: '0 3px 0 rgba(0,0,0,0.55)',
        }}
      />

      {/* Left: KERTAJAYA (ALWAYS LEFT — Pagar 11) */}
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{fontSize: 13, color: PX.gold, textShadow: '2px 2px 0 #000'}}>
          KERTAJAYA
        </div>
        <div
          style={{
            fontSize: 8,
            color: PX.goldHi,
            background: '#2C2314',
            border: `2px solid ${PX.goldShadow}`,
            padding: '3px 6px',
          }}
        >
          {kertajayaRerunHp ? 'THN 10+ HP' : 'TANPA HP'}
        </div>
        {heldScore ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#1E1A14',
              border: `2px solid ${kLeads ? PX.gold : '#52493E'}`,
              padding: '3px 8px',
              fontSize: 9,
              color: PX.goldHi,
            }}
          >
            <span style={{color: '#B8AEA0', fontSize: 8}}>
              SKOR THN KE-{heldScore.checkpointYear}:
            </span>
            <span style={{color: PX.gold, fontSize: 12}}>{heldScore.k}</span>
            {kLeads ? <span style={{color: PX.green, fontSize: 8}}>&gt;UNGGUL</span> : null}
          </div>
        ) : null}
      </div>

      {/* Center: Year Clock + Sealed Question Indicator */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 9,
          translate: '-50% 0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {yearLabel ? (
          <div
            style={{
              background: '#221E1A',
              border: '2px solid #7A6E5D',
              padding: '5px 12px',
              fontSize: 11,
              color: PX.white,
              whiteSpace: 'nowrap',
            }}
          >
            {yearLabel}
          </div>
        ) : (
          <div
            style={{
              background: '#221E1A',
              border: '2px solid #52493E',
              padding: '5px 12px',
              fontSize: 10,
              color: '#D8CFC2',
              whiteSpace: 'nowrap',
            }}
          >
            DUA DUNIA PARALEL
          </div>
        )}
        {sealedQuestion ? (
          <div
            style={{
              background: '#2B2012',
              border: `2px solid ${PX.gold}`,
              padding: '5px 8px',
              fontSize: 8,
              color: PX.gold,
              whiteSpace: 'nowrap',
            }}
            title="Pertanyaan inti disegel sampai akhir"
          >
            [?] DISEGEL
          </div>
        ) : null}
      </div>

      {/* Right: MEKARSARI (ALWAYS RIGHT — Pagar 11) */}
      <div
        style={{
          position: 'absolute',
          right: 18,
          top: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {heldScore ? (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#141C24',
              border: `2px solid ${heldScore.crackedM ? PX.red : mLeads ? PX.blueLight : '#405060'}`,
              padding: '3px 8px',
              fontSize: 9,
              color: '#E4F2FF',
            }}
          >
            {mLeads ? <span style={{color: PX.blueLight, fontSize: 8}}>&gt;UNGGUL</span> : null}
            <span style={{color: '#9CB2C8', fontSize: 8}}>
              SKOR THN KE-{heldScore.checkpointYear}:
            </span>
            <span style={{color: PX.blueLight, fontSize: 12}}>{heldScore.m}</span>
            {heldScore.crackedM ? (
              <span style={{color: PX.red, fontSize: 8}} title="Dampak gelombang penipuan">
                /!
              </span>
            ) : null}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 8,
            color: '#D8EEFF',
            background: '#162636',
            border: '2px solid #3C6C9C',
            padding: '3px 6px',
          }}
        >
          BEBAS HP
        </div>
        <div style={{fontSize: 13, color: PX.blueLight, textShadow: '2px 2px 0 #000'}}>
          MEKARSARI
        </div>
      </div>
    </div>
  );
};
