import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {W} from '../lib/tokens';
import {PIXEL_FONT} from '../pixelFont';
import {PX, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {pxSnap, step01} from './plan';
import {ParallelMapStage} from './map';

/**
 * Direct Pixel Flip Number: flips old -> new directly in 8 frames without EVER showing
 * intermediate numbers (strict compliance with Pagar 3 & 11c!).
 */
export const FlipScoreNumber: React.FC<{
  prevVal: number | null;
  nextVal: number;
  flipAt: number;
  color: string;
  fontSize?: number;
}> = ({prevVal, nextVal, flipAt, color, fontSize = 44}) => {
  const f = useCurrentFrame();
  const half = 5;
  let shown = nextVal;
  let scaleY = 1;

  if (prevVal === null) {
    if (f < flipAt) return null;
    const u = step01(f, flipAt, flipAt + 8, 4);
    scaleY = Math.max(0.15, u);
  } else if (f < flipAt) {
    shown = prevVal;
    scaleY = 1;
  } else if (f < flipAt + half) {
    shown = prevVal;
    scaleY = Math.max(0.12, 1 - (f - flipAt) / half);
  } else if (f < flipAt + half * 2) {
    shown = nextVal;
    scaleY = Math.max(0.12, (f - (flipAt + half)) / half);
  }

  return (
    <div
      style={{
        display: 'inline-block',
        transform: `scaleY(${scaleY.toFixed(2)})`,
        fontFamily: PIXEL_FONT,
        fontSize,
        color,
        lineHeight: 1,
        textShadow: '4px 4px 0 #000',
      }}
    >
      {shown}
    </div>
  );
};

export interface CheckpointSceneConfig {
  year: number;
  prevK: number | null;
  prevM: number | null;
  k: number;
  m: number;
  dur: number;
  subtitle?: string;
  dimmerLeadBadge?: boolean; // Y4: "jaraknya menyusut"
  sparkleM?: boolean; // Y2: "Nuansa Mekarsari cepat dan berkilau"
  crossoverY6?: boolean; // Y6: badge glides quietly M -> K
  glitchM?: boolean; // Y12: scar/crack on Mekarsari card corner
  marketTier?: 0 | 1 | 2;
  isFinalY20?: boolean; // Y20: grander card + A8a intro at localF=163
  introAtF?: number;
}

/**
 * Template A1 Checkpoint (used 8 times: Y2, Y4, Y6, Y10, Y12, Y14, Y17, Y20).
 * Rhythm: Beku -> Kartu masuk + flip angka -> Cair. Zero bars, zero trend lines, zero difference charts.
 */
export const CheckpointBeat: React.FC<CheckpointSceneConfig> = ({
  year,
  prevK,
  prevM,
  k,
  m,
  dur,
  subtitle,
  dimmerLeadBadge = false,
  sparkleM = false,
  crossoverY6 = false,
  glitchM = false,
  marketTier = 0,
  isFinalY20 = false,
  introAtF = 163,
}) => {
  const f = useCurrentFrame();
  const freezeStart = 12;
  const cardEnter = 18;
  const flipAt = 28;
  const freezeEnd = Math.min(dur - 18, isFinalY20 ? 150 : 96);

  const enterU = step01(f, cardEnter, cardEnter + 10, 5);
  const showCards = f >= cardEnter;

  const kWins = k > m;
  // Badge X position: left card center = 340, right card center = 940
  let badgeX = kWins ? 340 : 940;
  if (crossoverY6) {
    const glideU = step01(f, flipAt + 8, flipAt + 88, 16);
    badgeX = pxSnap(940 + (340 - 940) * glideU, 4);
  }
  const badgeColor = badgeX < 640 ? PX.gold : PX.blueLight;
  const badgeOpacity = dimmerLeadBadge ? 0.58 : 1;

  const cardW = isFinalY20 ? 460 : 420;
  const cardH = isFinalY20 ? 226 : 196;
  const leftCardX = 340 - cardW / 2;
  const rightCardX = 940 - cardW / 2;
  const cardY = isFinalY20 ? 196 : 214;

  const showA8aIntro = isFinalY20 && f >= introAtF;

  return (
    <ParallelMapStage
      focus="dual"
      dimAll={showCards ? 0.42 : 0.14}
      marketTier={marketTier}
      freezeWindow={[freezeStart, freezeEnd]}
    >
      {/* Year Checkpoint Header */}
      {showCards ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: enterU,
            zIndex: 45,
            pointerEvents: 'none',
          }}
        >
          <PixelChip
            text={isFinalY20 ? 'SKOR AKHIR • TAHUN KE-20' : `CHECKPOINT • TAHUN KE-${year}`}
            x={W / 2}
            y={114}
            centerX
            borderColor={PX.gold}
            bg="#181410"
            color={PX.goldHi}
            fontSize={isFinalY20 ? 16 : 14}
          />

          {/* Left Card: KERTAJAYA */}
          <PixelCard
            x={leftCardX}
            y={cardY}
            w={cardW}
            h={cardH}
            borderColor={kWins && (!crossoverY6 || f >= flipAt + 60) ? PX.gold : '#685E50'}
            bg="rgba(22, 19, 15, 0.96)"
            pad="22px 26px"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontSize: 15, color: PX.gold}}>KERTAJAYA</div>
            <div style={{fontSize: 9, color: '#BFB4A4'}}>DESA TANPA HP</div>
            <FlipScoreNumber
              prevVal={prevK}
              nextVal={k}
              flipAt={flipAt}
              color={PX.goldHi}
              fontSize={isFinalY20 ? 52 : 44}
            />
            <div style={{fontSize: 9, color: '#9E9486'}}>TAHUN KE-{year}</div>
          </PixelCard>

          {/* Right Card: MEKARSARI */}
          <PixelCard
            x={rightCardX}
            y={cardY}
            w={cardW}
            h={cardH}
            borderColor={glitchM ? PX.red : !kWins ? PX.blueLight : '#4A5A6A'}
            bg="rgba(16, 22, 30, 0.96)"
            pad="22px 26px"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontSize: 15, color: PX.blueLight}}>MEKARSARI</div>
            <div style={{fontSize: 9, color: '#9EB6CC'}}>DESA BEBAS HP</div>
            <FlipScoreNumber
              prevVal={prevM}
              nextVal={m}
              flipAt={flipAt}
              color="#E8F4FF"
              fontSize={isFinalY20 ? 52 : 44}
            />
            <div style={{fontSize: 9, color: '#869CB2'}}>TAHUN KE-{year}</div>

            {/* Y2 fast sparkling pixel accents on Mekarsari first reveal */}
            {sparkleM
              ? [
                  [22, 24],
                  [cardW - 34, 30],
                  [34, cardH - 32],
                  [cardW - 42, cardH - 28],
                ].map(([sx, sy], idx) => {
                  const on = Math.floor((f + idx * 5) / 6) % 2 === 0;
                  return on ? (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: sx,
                        top: sy,
                        width: 8,
                        height: 8,
                        background: PX.blueLight,
                        boxShadow: '0 0 0 2px #FFFFFF',
                      }}
                    />
                  ) : null;
                })
              : null}

            {/* Y12 small corner glitch/crack scar on card */}
            {glitchM ? (
              <svg
                width={54}
                height={54}
                viewBox="0 0 18 18"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  imageRendering: 'pixelated',
                }}
              >
                <path
                  d="M18 2 L13 5 L15 9 L9 12 L11 16"
                  stroke={PX.red}
                  strokeWidth={1.6}
                  fill="none"
                />
                <rect x={14} y={0} width={4} height={2} fill={PX.red} />
              </svg>
            ) : null}
          </PixelCard>

          {/* Single "> UNGGUL" marker attached to leading card */}
          {f >= flipAt + 6 ? (
            <div
              style={{
                position: 'absolute',
                left: badgeX,
                top: cardY - 20,
                translate: '-50% 0',
                opacity: badgeOpacity,
                background: '#161412',
                border: `3px solid ${badgeColor}`,
                boxShadow: '4px 4px 0 rgba(0,0,0,0.7)',
                padding: '6px 14px',
                fontFamily: PIXEL_FONT,
                fontSize: 11,
                color: badgeColor,
                whiteSpace: 'nowrap',
              }}
            >
              &gt; UNGGUL
            </div>
          ) : null}

          {/* Subtitle / A8a Intro Banner */}
          {showA8aIntro ? (
            <PixelCard
              x={W / 2}
              y={534}
              w={880}
              center
              borderColor={PX.gold}
              bg="rgba(20, 18, 16, 0.96)"
              pad="18px 26px"
            >
              <div style={{fontSize: 14, color: PX.gold, textAlign: 'center', lineHeight: 1.6}}>
                SEKARANG JAWABAN TEBAKANMU, SATU PER SATU.
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 16,
                  marginTop: 12,
                  fontSize: 10,
                  color: PX.goldHi,
                }}
              >
                <span>[?] DIKA</span>
                <span>[?] ENDANG</span>
                <span>[?] HARJO</span>
                <span>[?] TIA</span>
                <span>[?] OMEN</span>
              </div>
            </PixelCard>
          ) : subtitle && f >= flipAt + 16 ? (
            <PixelChip
              text={subtitle}
              x={W / 2}
              y={456}
              centerX
              borderColor={badgeColor}
              color={PX.goldHi}
              bg="rgba(18, 16, 14, 0.94)"
              fontSize={12}
            />
          ) : null}
        </div>
      ) : null}
    </ParallelMapStage>
  );
};

/**
 * Character Intro / Status Card (Portrait + Name + Age + Role + "?" slot or Verdict).
 */
export const CharacterHeaderCard: React.FC<{
  portrait: string;
  name: string;
  age?: number;
  role: string;
  verdictText?: string; // omit for "[ ? ]"
  verdictAccent?: string;
  mechanism?: string;
  extraBadge?: string;
  y?: number;
}> = ({
  portrait,
  name,
  age,
  role,
  verdictText,
  verdictAccent = PX.gold,
  mechanism,
  extraBadge,
  y = 66,
}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: y,
      translate: '-50% 0',
      zIndex: 48,
      pointerEvents: 'none',
    }}
  >
    <PixelCard
      borderColor={verdictText ? verdictAccent : PX.gold}
      bg="rgba(18, 16, 14, 0.95)"
      pad="10px 18px"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        minWidth: verdictText ? 680 : 540,
      }}
    >
      <div
        style={{
          width: 52,
          height: 64,
          overflow: 'hidden',
          background: '#26211C',
          border: `2px solid ${verdictText ? verdictAccent : PX.gold}`,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <PixelSprite src={portrait} x={-4} y={2} w={60} h={124} />
      </div>
      <div style={{flex: 1}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{fontSize: 15, color: PX.goldHi}}>{name}</span>
          {age !== undefined ? (
            <span style={{fontSize: 11, color: PX.gold}}>• {age} THN</span>
          ) : null}
        </div>
        <div style={{fontSize: 9, color: '#C6BAA8', marginTop: 6}}>{role}</div>
        {mechanism ? (
          <div style={{fontSize: 9, color: verdictAccent, marginTop: 6}}>
            MEKANISME: {mechanism}
          </div>
        ) : null}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6}}>
        <div
          style={{
            background: verdictText ? '#1A2418' : '#2A2218',
            border: `2px solid ${verdictText ? verdictAccent : PX.gold}`,
            padding: '7px 12px',
            fontSize: verdictText ? 11 : 16,
            color: verdictText ? verdictAccent : PX.gold,
            whiteSpace: 'nowrap',
          }}
        >
          {verdictText ? `> ${verdictText}` : '?'}
        </div>
        {extraBadge ? (
          <div
            style={{
              background: '#2B1F12',
              border: `2px solid ${PX.gold}`,
              padding: '3px 8px',
              fontSize: 8,
              color: PX.goldHi,
              whiteSpace: 'nowrap',
            }}
          >
            {extraBadge}
          </div>
        ) : null}
      </div>
    </PixelCard>
  </div>
);

/**
 * Academic Study Quote Card (Pagar 6 & 7: simple quote card over dimmed plate, zero scenes/charts).
 */
export const StudyQuoteBeat: React.FC<{
  citation: string;
  journal: string;
  points: Array<{text: string; atF: number}>;
  closingText: string;
  closingAtF: number;
  accent?: string;
}> = ({citation, journal, points, closingText, closingAtF, accent = PX.gold}) => {
  const f = useCurrentFrame();
  const enterU = step01(f, 0, 12, 6);

  return (
    <ParallelMapStage focus="dual" dimAll={0.7}>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: enterU,
          zIndex: 46,
          pointerEvents: 'none',
        }}
      >
        <PixelCard
          w={980}
          borderColor={accent}
          bg="rgba(18, 16, 15, 0.96)"
          pad="26px 34px"
          style={{marginTop: 12}}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #3A332B',
              paddingBottom: 14,
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{fontSize: 10, color: accent, marginBottom: 8}}>
                BUKTI MEKANISME • STUDI TERVERIFIKASI
              </div>
              <div style={{fontSize: 18, color: PX.white}}>{citation}</div>
            </div>
            <div
              style={{
                background: '#24201B',
                border: '2px solid #62584A',
                padding: '6px 12px',
                fontSize: 9,
                color: '#D8CFC2',
              }}
            >
              {journal}
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {points.map((pt) => {
              const vis = f >= pt.atF;
              return (
                <div
                  key={pt.text}
                  style={{
                    opacity: vis ? 1 : 0.14,
                    background: vis ? '#231F1B' : '#191614',
                    border: `2px solid ${vis ? accent : '#342E28'}`,
                    padding: '12px 16px',
                    fontSize: 12,
                    lineHeight: 1.65,
                    color: PX.goldHi,
                  }}
                >
                  &gt; {pt.text}
                </div>
              );
            })}
          </div>

          {f >= closingAtF ? (
            <div
              style={{
                marginTop: 20,
                background: '#2A2114',
                border: `3px solid ${PX.gold}`,
                padding: '13px 18px',
                textAlign: 'center',
                fontSize: 13,
                lineHeight: 1.5,
                color: PX.gold,
              }}
            >
              &ldquo;{closingText}&rdquo;
            </div>
          ) : null}
        </PixelCard>
      </AbsoluteFill>
    </ParallelMapStage>
  );
};

/**
 * Classic 32-bit RPG Dialog Box safely above y=656 caption zone.
 */
export const RpgDialogBox: React.FC<{
  speaker: string;
  text: string;
  accent?: string;
  x?: number;
  y?: number;
  w?: number;
  revealProgress?: number; // 0..1 stepped typewriter
}> = ({speaker, text, accent = PX.gold, x = 80, y = 496, w = 760, revealProgress = 1}) => {
  const count = Math.max(1, Math.round(text.length * Math.min(1, Math.max(0, revealProgress))));
  const shown = text.slice(0, count);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        zIndex: 49,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: '#161310',
          border: `3px solid ${accent}`,
          padding: '5px 12px',
          fontFamily: PIXEL_FONT,
          fontSize: 10,
          color: accent,
          marginBottom: -3,
          marginLeft: 14,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {speaker}
      </div>
      <div
        style={{
          background: 'rgba(18, 16, 14, 0.96)',
          border: `3px solid ${accent}`,
          boxShadow: '5px 5px 0 rgba(0,0,0,0.75)',
          padding: '16px 20px',
          fontFamily: PIXEL_FONT,
          fontSize: 12,
          lineHeight: 1.75,
          color: PX.white,
          minHeight: 84,
          boxSizing: 'border-box',
        }}
      >
        {shown}
      </div>
    </div>
  );
};
