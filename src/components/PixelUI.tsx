import React, {useContext} from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {W, H} from '../lib/tokens';
import {PIXEL_FONT} from '../pixelFont';
import {hudStateAt} from '../demoPlan';
import {LiveMapBg, LiveMapContext, type MapEra} from './LiveMapBg';

export type HudStateFn = (globalFrame: number) => {
  year: number;
  s: number;
  t: number;
  yearLabel?: string;
};

export const HudContext = React.createContext<HudStateFn>(hudStateAt);

export const PX = {
  bgDark: '#141210',
  bgPanel: 'rgba(20, 18, 16, 0.94)',
  bgPanelSolid: '#181512',
  bgCream: '#F4ECE0',
  borderDark: '#3B342D',
  gold: '#FFDC78',
  goldHi: '#FFF0C8',
  goldShadow: '#9B7526',
  blue: '#5CA0DE',
  blueLight: '#8CC8FF',
  green: '#8CE68C',
  greenHi: '#C8FAC8',
  greenDark: '#2F8A45',
  amber: '#F0B482',
  red: '#F07864',
  redDark: '#B8362B',
  white: '#FFFFFF',
  ink: '#1E1814',
} as const;

export const HUD_H = 54;
export const CAPTION_SAFE_TOP = 660; // bottom 60px (660..720) reserved for captions

export const PixelSprite: React.FC<{
  src: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  flipX?: boolean;
  style?: React.CSSProperties;
}> = ({src, x, y, w, h, flipX = false, style}) => (
  <Img
    src={staticFile(`sprites/${src}`)}
    className="pixel-img"
    style={{
      position: x !== undefined || y !== undefined ? 'absolute' : 'relative',
      left: x,
      top: y,
      width: w,
      height: h,
      transform: flipX ? 'scaleX(-1)' : undefined,
      imageRendering: 'pixelated',
      ...style,
    }}
  />
);

export const PixelCard: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  borderColor?: string;
  bg?: string;
  pad?: string;
  center?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  x,
  y,
  w,
  h,
  borderColor = PX.gold,
  bg = PX.bgPanel,
  pad = '14px 18px',
  center = false,
  style,
  children,
}) => (
  <div
    style={{
      position: x !== undefined || y !== undefined ? 'absolute' : 'relative',
      left: x,
      top: y,
      width: w,
      height: h,
      translate: center ? '-50% -50%' : undefined,
      background: bg,
      border: `3px solid ${borderColor}`,
      boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.08), 5px 5px 0 rgba(0,0,0,0.65)`,
      padding: pad,
      boxSizing: 'border-box',
      fontFamily: PIXEL_FONT,
      color: PX.goldHi,
      ...style,
    }}
  >
    {children}
  </div>
);

export const PixelChip: React.FC<{
  text: string;
  x?: number;
  y?: number;
  borderColor?: string;
  color?: string;
  bg?: string;
  fontSize?: number;
  centerX?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  x,
  y,
  borderColor = PX.gold,
  color = PX.goldHi,
  bg = PX.bgPanel,
  fontSize = 13,
  centerX = false,
  style,
}) => (
  <div
    style={{
      position: x !== undefined || y !== undefined ? 'absolute' : 'relative',
      left: x,
      top: y,
      translate: centerX ? '-50% 0' : undefined,
      display: 'inline-block',
      background: bg,
      border: `2px solid ${borderColor}`,
      boxShadow: '3px 3px 0 rgba(0,0,0,0.65)',
      padding: '8px 14px',
      fontFamily: PIXEL_FONT,
      fontSize,
      lineHeight: 1.3,
      color,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {text}
  </div>
);

export const PixelBoard: React.FC<{
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  w?: number;
  accent?: string;
  centerX?: boolean;
}> = ({title, subtitle, x, y, w, accent = PX.gold, centerX = true}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      translate: centerX ? '-50% 0' : undefined,
      background: '#4A311D',
      border: `3px solid ${accent}`,
      boxShadow: 'inset 0 3px 0 #7C5333, inset 0 -3px 0 #2D1D10, 4px 4px 0 rgba(0,0,0,0.65)',
      padding: '10px 20px',
      textAlign: 'center',
      fontFamily: PIXEL_FONT,
    }}
  >
    <div style={{fontSize: 15, color: accent, letterSpacing: '0.04em'}}>{title}</div>
    {subtitle ? (
      <div style={{fontSize: 10, color: PX.goldHi, marginTop: 6}}>{subtitle}</div>
    ) : null}
  </div>
);

export const PixelBubble: React.FC<{
  text: string;
  x: number;
  y: number;
  maxW?: number;
  tail?: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'none';
  accent?: string;
  at?: number;
}> = ({text, x, y, maxW = 360, tail = 'bottom-left', accent = PX.ink, at = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spring({frame: f - at, fps, config: {damping: 14, stiffness: 210, mass: 0.65}});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        maxWidth: maxW,
        transform: `scale(${s})`,
        transformOrigin: tail === 'bottom-right' ? '80% 100%' : '20% 100%',
      }}
    >
      <div
        style={{
          background: '#FFFDF7',
          border: `3px solid ${accent}`,
          boxShadow: '4px 4px 0 rgba(0,0,0,0.55)',
          padding: '12px 16px',
          fontFamily: PIXEL_FONT,
          fontSize: 12,
          lineHeight: 1.6,
          color: PX.ink,
        }}
      >
        {text}
      </div>
      {tail !== 'none' ? (
        <div
          style={{
            position: 'relative',
            marginLeft: tail === 'bottom-left' ? 28 : tail === 'bottom-center' ? '45%' : undefined,
            marginRight: tail === 'bottom-right' ? 28 : undefined,
            float: tail === 'bottom-right' ? 'right' : undefined,
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `14px solid ${accent}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -7,
              top: -16,
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '11px solid #FFFDF7',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export const PixelStamp: React.FC<{
  text: string;
  x: number;
  y: number;
  at: number;
  color?: string;
  rot?: number;
  fontSize?: number;
}> = ({text, x, y, at, color = PX.gold, rot = -4, fontSize = 20}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spring({frame: f - at, fps, config: {damping: 11, stiffness: 260, mass: 0.5}});
  const scale = interpolate(s, [0, 1], [1.45, 1]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        scale: String(scale),
        opacity: Math.min(1, s * 1.6),
        background: 'rgba(20, 18, 16, 0.94)',
        border: `4px solid ${color}`,
        boxShadow: `inset 0 0 0 2px #141210, inset 0 0 0 4px ${color}, 6px 6px 0 rgba(0,0,0,0.65)`,
        padding: '14px 24px',
        fontFamily: PIXEL_FONT,
        fontSize,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

export const RiverShimmer: React.FC<{opacity?: number}> = ({opacity = 0.95}) => {
  const f = useCurrentFrame();
  const sparkles = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      {sparkles.map((i) => {
        const yBase = ((f * 1.8 + i * 92) % 660) + 30;
        const cx = 640 + Math.sin(yBase / 80) * 12;
        const pulse = 0.35 + 0.65 * Math.abs(Math.sin(f / 9 + i * 1.4));
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: cx - 4 + (i % 3) * 3,
                top: yBase,
                width: 4,
                height: 10,
                background: '#FFFFFF',
                opacity: pulse,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: cx + 5 - (i % 2) * 8,
                top: (yBase + 40) % 690,
                width: 4,
                height: 4,
                background: '#D6F0FF',
                opacity: pulse * 0.8,
              }}
            />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

export const PixelMapBg: React.FC<{
  plate?: 'y1' | 'y2' | 'drought' | 'sawah_kering';
  zoomFrom?: number;
  zoomTo?: number;
  panX?: [number, number];
  panY?: [number, number];
  dim?: number;
  blurPx?: number;
  shimmer?: boolean;
  dur?: number;
}> = ({
  plate = 'y1',
  zoomFrom = 1,
  zoomTo = 1.06,
  panX = [0, 0],
  panY = [0, 0],
  dim = 0.15,
  blurPx = 0,
  shimmer = true,
  dur = 300,
}) => {
  const f = useCurrentFrame();
  const mapMode = useContext(LiveMapContext);
  if (mapMode === 'full' && blurPx === 0 && plate !== 'sawah_kering') {
    const era: MapEra = plate === 'y2' ? 'y2' : plate === 'drought' ? 'drought' : 'y1';
    return (
      <LiveMapBg
        era={era}
        zoomFrom={zoomFrom}
        zoomTo={zoomTo}
        panX={panX}
        panY={panY}
        dim={dim}
        shimmer={shimmer}
        dur={dur}
      />
    );
  }
  const p = interpolate(f, [0, Math.max(1, dur)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sc = zoomFrom + (zoomTo - zoomFrom) * p;
  const tx = panX[0] + (panX[1] - panX[0]) * p;
  const ty = panY[0] + (panY[1] - panY[0]) * p;

  const src =
    plate === 'y1'
      ? Math.floor(f / 18) % 2 === 0
        ? 'plate_map_y1_a.png'
        : 'plate_map_y1_b.png'
      : plate === 'y2'
        ? 'plate_map_y2.png'
        : plate === 'drought'
          ? 'plate_map_drought.png'
          : 'plate_sawah_kering.png';

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#1B2A18'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`,
          transformOrigin: '50% 50%',
          filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
        }}
      >
        <Img
          src={staticFile(`sprites/${src}`)}
          className="pixel-img"
          style={{width: W, height: H, objectFit: 'cover', imageRendering: 'pixelated'}}
        />
        {shimmer && plate !== 'sawah_kering' ? <RiverShimmer opacity={0.85} /> : null}
      </AbsoluteFill>
      {dim > 0 ? <AbsoluteFill style={{backgroundColor: '#0A0908', opacity: dim}} /> : null}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.48) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const GlobalHud: React.FC = () => {
  const globalFrame = useCurrentFrame();
  const stateFn = useContext(HudContext);
  const {year, s, t, yearLabel} = stateFn(globalFrame);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: W,
        height: HUD_H,
        pointerEvents: 'none',
        fontFamily: PIXEL_FONT,
        zIndex: 50,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: 44,
          background: '#141210',
          borderBottom: '2px solid #000',
        }}
      />
      {/* Left: SINARBARU */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 12,
          fontSize: 16,
          color: PX.gold,
          textShadow: '2px 2px 0 #000',
          whiteSpace: 'nowrap',
        }}
      >
        SINARBARU {s}
      </div>
      {/* Center: TAHUN */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 12,
          translate: '-50% 0',
          fontSize: yearLabel ? 13 : 16,
          color: PX.white,
          textShadow: '2px 2px 0 #000',
          whiteSpace: 'nowrap',
        }}
      >
        {yearLabel ?? `TAHUN ${year}`}
      </div>
      {/* Right: TANJUNGSARI */}
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 12,
          fontSize: 16,
          color: PX.green,
          textShadow: '2px 2px 0 #000',
          whiteSpace: 'nowrap',
        }}
      >
        TANJUNGSARI {t}
      </div>
      {/* Score bars at y=44..52 */}
      <div style={{position: 'absolute', left: 0, top: 44, width: W, height: 8, background: '#000'}} />
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 44,
          width: s * 3,
          height: 6,
          background: PX.gold,
          boxShadow: 'inset 0 2px 0 #FFF0B4',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 44,
          width: t * 3,
          height: 6,
          background: PX.green,
          boxShadow: 'inset 0 2px 0 #C8FAC8',
        }}
      />
    </div>
  );
};
