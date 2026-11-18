import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {W, H} from '../lib/tokens';
import {PopIn, SlideIn} from '../lib/paper/kit';
import {localF} from '../demoPlan';
import {PX, PixelBoard, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';

export const B09_SatuPembedaTahun1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const oneDiffAt = localF('B09', 116.94); // "Yang membedakan mereka cuma satu"
  const ageAt = localF('B09', 121.48); // "Oh ya, kenapa selisih umurnya jauh sekali?"
  const year1WipeAt = localF('B09', 127.68); // "Simulasinya berjalan tahun per tahun. Gas."

  // Split screen calm drift
  const splitZoom = interpolate(f, [0, ageAt], [1.0, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Wipe progress to TAHUN 1 screen
  const wipeP = interpolate(f, [year1WipeAt, year1WipeAt + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titlePop = spring({
    frame: Math.max(0, f - (year1WipeAt + 14)),
    fps,
    config: {damping: 12, stiffness: 190, mass: 0.7},
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#141210'}}>
      {/* Phase 1: Split Contrast Screen */}
      <AbsoluteFill>
        {/* Left: Sinarbaru / Kevin */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W / 2,
            height: H,
            overflow: 'hidden',
            borderRight: `3px solid ${PX.gold}`,
            boxSizing: 'border-box',
          }}
        >
          <Img
            src={staticFile('sprites/plate_map_y1_a.png')}
            className="pixel-img"
            style={{
              width: W,
              height: H,
              objectFit: 'cover',
              objectPosition: 'left center',
              transform: `scale(${splitZoom})`,
              transformOrigin: '25% 50%',
              imageRendering: 'pixelated',
            }}
          />
          <div style={{position: 'absolute', inset: 0, background: 'rgba(10,16,24,0.35)'}} />
          <PixelBoard
            title="SINARBARU"
            subtitle="BOLEH COBA HAL BARU"
            x={320}
            y={92}
            w={360}
            accent={PX.gold}
          />
          <div style={{position: 'absolute', left: 266, top: 215}}>
            <PixelSprite src="portrait_kevin_happy.png" w={108} h={222} />
          </div>
        </div>

        {/* Right: Tanjungsari / Mulyadi */}
        <div
          style={{
            position: 'absolute',
            left: W / 2,
            top: 0,
            width: W / 2,
            height: H,
            overflow: 'hidden',
            borderLeft: `3px solid ${PX.green}`,
            boxSizing: 'border-box',
          }}
        >
          <Img
            src={staticFile('sprites/plate_map_y1_a.png')}
            className="pixel-img"
            style={{
              position: 'absolute',
              right: 0,
              width: W,
              height: H,
              objectFit: 'cover',
              transform: `scale(${splitZoom})`,
              transformOrigin: '75% 50%',
              filter: 'saturate(0.7) sepia(0.2)',
              imageRendering: 'pixelated',
            }}
          />
          <div style={{position: 'absolute', inset: 0, background: 'rgba(22,14,10,0.45)'}} />
          <PixelBoard
            title="TANJUNGSARI"
            subtitle="CARA LAMA SAJA"
            x={320}
            y={92}
            w={360}
            accent={PX.green}
          />
          <div style={{position: 'absolute', left: 266, top: 215}}>
            <PixelSprite src="portrait_mulyadi_stern.png" w={108} h={222} />
          </div>
        </div>

        {/* Center divider card */}
        {f >= oneDiffAt && f < ageAt ? (
          <PopIn at={oneDiffAt} seed="onediff">
            <PixelCard
              x={640}
              y={526}
              w={820}
              center
              borderColor={PX.gold}
              bg="rgba(16, 14, 12, 0.96)"
              pad="16px 24px"
            >
              <div style={{fontSize: 13, color: PX.white, textAlign: 'center', lineHeight: 1.7}}>
                YANG MEMBEDAKAN MEREKA CUMA SATU:
              </div>
              <div style={{fontSize: 16, color: PX.gold, textAlign: 'center', marginTop: 8}}>
                APA YANG DIIZINKAN PEMIMPINNYA
              </div>
            </PixelCard>
          </PopIn>
        ) : null}

        {/* Phase 2: Age Gap Mystery (26 vs 70) */}
        {f >= ageAt && wipeP < 0.99 ? (
          <SlideIn at={ageAt} dy={30} dur={12}>
            <PixelCard
              x={640}
              y={530}
              w={760}
              center
              borderColor={PX.blueLight}
              bg="rgba(16, 14, 12, 0.96)"
              pad="16px 24px"
            >
              <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                <PixelChip text="26 TAHUN" borderColor={PX.blueLight} color={PX.blueLight} fontSize={16} />
                <div style={{fontSize: 14, color: PX.gold}}>VS</div>
                <PixelChip text="70 TAHUN" borderColor={PX.amber} color={PX.amber} fontSize={16} />
              </div>
              <div style={{fontSize: 11, color: PX.goldHi, textAlign: 'center', marginTop: 12}}>
                KENAPA JAUH SEKALI? NANTI AKU KASIH TAHU.
              </div>
            </PixelCard>
          </SlideIn>
        ) : null}
      </AbsoluteFill>

      {/* Phase 3: Wipe to TAHUN 1 chapter title */}
      {wipeP > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${wipeP * 100}%`,
            height: H,
            overflow: 'hidden',
            background: '#161412',
            borderRight: wipeP < 1 ? `6px solid ${PX.gold}` : undefined,
          }}
        >
          <div style={{position: 'relative', width: W, height: H}}>
            {/* Subtle grid lines in chapter card */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(255,220,120,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,220,120,0.06) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 340,
                translate: '-50% -50%',
                transform: `scale(${titlePop})`,
              }}
            >
              <PixelCard w={680} borderColor={PX.gold} pad="38px 44px" style={{textAlign: 'center'}}>
                <div style={{fontSize: 13, color: PX.blueLight, marginBottom: 18}}>
                  SIMULASI DIMULAI
                </div>
                <div style={{fontSize: 54, color: PX.gold, letterSpacing: '0.06em'}}>
                  TAHUN 1
                </div>
                <div style={{fontSize: 12, color: PX.white, marginTop: 22}}>
                  HARI PERTAMA • KEDUA DESA SAMA KUAT
                </div>
              </PixelCard>
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
