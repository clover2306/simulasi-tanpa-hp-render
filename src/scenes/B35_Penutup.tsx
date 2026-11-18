import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {W, H} from '../lib/tokens';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';

const DUR = 1067; // 710.96 - 746.52s

export const B35_Penutup: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const betAnsAt = fullLocalF('B35', 716.04);
  const questionsAt = fullLocalF('B35', 729.0);
  const ctaAt = fullLocalF('B35', 741.42);

  const fadeOut = interpolate(f, [DUR - 28, DUR], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgScale = interpolate(f, [0, DUR], [1.0, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaS = spring({
    frame: Math.max(0, f - ctaAt),
    fps,
    config: {damping: 13, stiffness: 180},
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: fadeOut}}>
        <AbsoluteFill style={{transform: `scale(${bgScale.toFixed(4)})`}}>
          <Img
            src={staticFile('sprites/bg_sunset.png')}
            className="pixel-img"
            style={{width: W, height: H, objectFit: 'cover', imageRendering: 'pixelated'}}
          />
        </AbsoluteFill>
        <AbsoluteFill style={{backgroundColor: '#120C14', opacity: 0.42}} />

        {/* Calm portraits flanking */}
        <div style={{position: 'absolute', left: 90, top: 224}}>
          <PixelSprite src="portrait_kevin_happy.png" w={140} h={288} />
        </div>
        <div style={{position: 'absolute', right: 90, top: 224}}>
          <PixelSprite src="portrait_mulyadi_neutral.png" w={140} h={288} flipX />
        </div>

        {/* Phase 1: Thought experiment note */}
        {f < betAnsAt ? (
          <PixelCard x={640} y={290} w={740} center borderColor={PX.gold} pad="28px 34px">
            <div style={{fontSize: 18, color: PX.gold, textAlign: 'center'}}>
              EKSPERIMEN PIKIRAN
            </div>
            <div style={{fontSize: 12, color: PX.white, textAlign: 'center', marginTop: 22, lineHeight: 1.8}}>
              SEMUA ATURAN ADA DI DESKRIPSI KALAU MAU DIBANTAH.
            </div>
          </PixelCard>
        ) : null}

        {/* Phase 2: Bet answer */}
        {f >= betAnsAt && f < questionsAt ? (
          <PixelCard x={640} y={290} w={760} center borderColor={PX.gold} pad="26px 32px">
            <div style={{fontSize: 18, color: PX.gold, textAlign: 'center'}}>
              JAWABAN TARUHAN
            </div>
            <div style={{marginTop: 24, fontSize: 12, color: PX.goldHi, lineHeight: 2.0}}>
              <div>&gt; DESA ANAK MUDA — MENANG DI DUNIA INI</div>
              <div style={{color: PX.greenHi}}>&gt; DESA ORANG TUA — MEMIMPIN DI TAHUN KEDUA</div>
            </div>
          </PixelCard>
        ) : null}

        {/* Phase 3: Reflection & Subscribe CTA */}
        {f >= questionsAt ? (
          <PixelCard x={640} y={320} w={760} center borderColor={PX.gold} pad="26px 32px">
            <div style={{fontSize: 13, color: PX.goldHi, textAlign: 'center', lineHeight: 1.9}}>
              PENGALAMAN 30 TAHUN ATAU VISI 10 TAHUN KE DEPAN?
            </div>
            <div style={{fontSize: 12, color: PX.amber, textAlign: 'center', marginTop: 18, lineHeight: 1.8}}>
              KALAU KAMU WARGA TANJUNGSARI, DI TAHUN KE BERAPA KAMU PINDAH?
            </div>
            <div
              style={{
                marginTop: 26,
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                transform: `scale(${f >= ctaAt ? ctaS : 0.9})`,
              }}
            >
              <PixelChip text="TULIS DI KOMENTAR!" borderColor={PX.gold} color={PX.gold} fontSize={12} />
              <PixelChip text="SUBSCRIBE!" borderColor={PX.red} bg="#3A1512" color={PX.white} fontSize={12} />
            </div>
          </PixelCard>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
