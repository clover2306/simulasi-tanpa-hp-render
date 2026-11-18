import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {W, H} from '../lib/tokens';
import {PIXEL_FONT} from '../pixelFont';
import {PX} from '../components/PixelUI';
import {HP_HUD_H, SekatBar} from './hud';

export type GeneratedBgName =
  | 'bg_desa_siang.png'
  | 'bg_peta_atas.png'
  | 'bg_sekolah.png'
  | 'bg_pasar.png'
  | 'bg_rumah_makan.png'
  | 'bg_toko_hp.png'
  | 'bg_bengkel.png'
  | 'bg_malam.png';

/**
 * Dual-world stage for interior & village scenes (Sekolah, Pasar, Rumah Makan, Desa Siang, Bengkel/Toko HP, Malam).
 * Kertajaya is ALWAYS on the left; Mekarsari is ALWAYS on the right (Pagar 11).
 * Even when zooming into one side (e.g. splitRatio = 0.74 or 0.26), the other side stays visible & dimmed!
 */
export const SplitWorldStage: React.FC<{
  leftBg: GeneratedBgName;
  rightBg: GeneratedBgName;
  splitRatio?: number; // 0.5 = equal 640|640, 0.74 = Kertajaya zoomed, 0.26 = Mekarsari zoomed
  leftScale?: number;
  rightScale?: number;
  leftTint?: string;
  rightTint?: string;
  dimLeft?: number;
  dimRight?: number;
  dimAll?: number;
  showSideTags?: boolean;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
}> = ({
  leftBg,
  rightBg,
  splitRatio = 0.5,
  leftScale = 1,
  rightScale = 1,
  leftTint,
  rightTint,
  dimLeft,
  dimRight,
  dimAll = 0,
  showSideTags = true,
  leftContent,
  rightContent,
  children,
}) => {
  const splitX = W * Math.min(0.78, Math.max(0.22, splitRatio));
  const rightW = W - splitX;

  const autoDimL = dimLeft ?? (splitRatio < 0.42 ? 0.52 : 0);
  const autoDimR = dimRight ?? (splitRatio > 0.58 ? 0.52 : 0);

  const lSc = leftScale;
  const rSc = rightScale;

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: PX.bgDark}}>
      {/* LEFT WORLD: KERTAJAYA */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: splitX,
          height: H,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: (splitX - W) / 2,
            top: 0,
            width: W,
            height: H,
            transform: Math.abs(lSc - 1) > 0.0001 ? `scale(${lSc})` : undefined,
            transformOrigin: '50% 55%',
          }}
        >
          <Img
            src={staticFile(`backgrounds/${leftBg}`)}
            className="pixel-img"
            style={{width: W, height: H, imageRendering: 'pixelated'}}
          />
        </div>
        {leftTint ? (
          <AbsoluteFill style={{background: leftTint, pointerEvents: 'none'}} />
        ) : null}
        <AbsoluteFill>{leftContent}</AbsoluteFill>
        {autoDimL > 0 ? (
          <AbsoluteFill
            style={{backgroundColor: '#08080C', opacity: autoDimL, pointerEvents: 'none'}}
          />
        ) : null}
        {showSideTags && splitX >= 240 ? (
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: HP_HUD_H + 10,
              background: 'rgba(20, 18, 16, 0.88)',
              border: `2px solid ${PX.gold}`,
              padding: '4px 9px',
              fontFamily: PIXEL_FONT,
              fontSize: 9,
              color: PX.gold,
              pointerEvents: 'none',
            }}
          >
            DUNIA KIRI • KERTAJAYA
          </div>
        ) : null}
      </div>

      {/* RIGHT WORLD: MEKARSARI */}
      <div
        style={{
          position: 'absolute',
          left: splitX,
          top: 0,
          width: rightW,
          height: H,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: (rightW - W) / 2,
            top: 0,
            width: W,
            height: H,
            transform: Math.abs(rSc - 1) > 0.0001 ? `scale(${rSc})` : undefined,
            transformOrigin: '50% 55%',
          }}
        >
          <Img
            src={staticFile(`backgrounds/${rightBg}`)}
            className="pixel-img"
            style={{width: W, height: H, imageRendering: 'pixelated'}}
          />
        </div>
        {rightTint ? (
          <AbsoluteFill style={{background: rightTint, pointerEvents: 'none'}} />
        ) : null}
        <AbsoluteFill>{rightContent}</AbsoluteFill>
        {autoDimR > 0 ? (
          <AbsoluteFill
            style={{backgroundColor: '#08080C', opacity: autoDimR, pointerEvents: 'none'}}
          />
        ) : null}
        {showSideTags && rightW >= 240 ? (
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: HP_HUD_H + 10,
              background: 'rgba(16, 24, 34, 0.88)',
              border: `2px solid ${PX.blueLight}`,
              padding: '4px 9px',
              fontFamily: PIXEL_FONT,
              fontSize: 9,
              color: PX.blueLight,
              pointerEvents: 'none',
            }}
          >
            DUNIA KANAN • MEKARSARI
          </div>
        ) : null}
      </div>

      {/* Solid Parallel-World Sekat */}
      <SekatBar x={splitX} top={0} height={H} />

      {dimAll > 0 ? (
        <AbsoluteFill
          style={{backgroundColor: '#0A0908', opacity: dimAll, pointerEvents: 'none', zIndex: 38}}
        />
      ) : null}

      {children}
    </AbsoluteFill>
  );
};
