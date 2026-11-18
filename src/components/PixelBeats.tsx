import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {W, H} from '../lib/tokens';
import {SlideIn, SparkleBurst} from '../lib/paper/kit';
import {PIXEL_FONT} from '../pixelFont';
import {PX, PixelCard, PixelChip, PixelMapBg, PixelSprite} from './PixelUI';

export type ShowcaseConfig = {
  who: 'kevin' | 'mulyadi';
  name: string;
  age: string;
  accent: string;
  ageColor: string;
  traitPrefix: string;
  traitColor: string;
  annotations: Array<{label: string; x: number; y: number; tx: number; ty: number}>;
  traits: Array<{text: string; at: number}>;
};

export const ShowcaseBeat: React.FC<{cfg: ShowcaseConfig; dur: number}> = ({cfg, dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const isKevin = cfg.who === 'kevin';

  // Calm zoom on the sunset backdrop
  const bgScale = interpolate(f, [0, dur], [1.0, 1.045], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blink = f % 100 >= 95;
  const spriteSrc = isKevin
    ? blink
      ? 'portrait_kevin_blink.png'
      : 'portrait_kevin_happy.png'
    : blink
      ? 'portrait_mulyadi_blink.png'
      : 'portrait_mulyadi_stern.png';

  const portraitEntrance = spring({frame: f, fps, config: {damping: 16, stiffness: 150, mass: 0.7}});
  const portraitY = interpolate(portraitEntrance, [0, 1], [40, 0]);
  // Gentle calm breathing (1px)
  const bob = Math.sin(f / 18) * 1.5;

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#1E1420'}}>
      <AbsoluteFill style={{transform: `scale(${bgScale.toFixed(4)})`, transformOrigin: '45% 50%'}}>
        <Img
          src={staticFile('sprites/bg_sunset.png')}
          className="pixel-img"
          style={{width: W, height: H, objectFit: 'cover', imageRendering: 'pixelated'}}
        />
      </AbsoluteFill>
      {/* Subtle dusk tint for Mulyadi contrast */}
      {!isKevin ? (
        <AbsoluteFill style={{backgroundColor: '#2A1008', opacity: 0.16, pointerEvents: 'none'}} />
      ) : null}

      {/* Portrait on left (y: 145..607, safely between HUD and 660 caption zone) */}
      <div
        style={{
          position: 'absolute',
          left: 168,
          top: 145 + portraitY + bob,
          width: 224,
          height: 462,
        }}
      >
        <PixelSprite src={spriteSrc} w={224} h={462} />
      </div>

      {/* Annotation chips + crisp pixel connector lines */}
      <svg
        width={W}
        height={H}
        style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}
      >
        {cfg.annotations.map((a, idx) => {
          const p = spring({
            frame: Math.max(0, f - (18 + idx * 18)),
            fps,
            config: {damping: 16, stiffness: 180},
          });
          if (p < 0.05) return null;
          return (
            <g key={a.label} opacity={p}>
              <line
                x1={a.x + 80}
                y1={a.y + 16}
                x2={a.tx}
                y2={a.ty + bob}
                stroke={cfg.accent}
                strokeWidth={3}
              />
              <rect
                x={a.tx - 5}
                y={a.ty + bob - 5}
                width={10}
                height={10}
                fill={cfg.accent}
                stroke={PX.bgDark}
                strokeWidth={2}
              />
            </g>
          );
        })}
      </svg>

      {cfg.annotations.map((a, idx) => {
        const enterAt = 18 + idx * 18;
        if (f < enterAt) return null;
        return (
          <SlideIn key={a.label} at={enterAt} dx={idx === 0 ? -24 : 24} dur={12}>
            <PixelChip
              text={a.label}
              x={a.x}
              y={a.y}
              borderColor={cfg.accent}
              color={PX.goldHi}
              fontSize={11}
            />
          </SlideIn>
        );
      })}

      {/* Right side: Name card + 3 stat rows */}
      <SlideIn at={4} dx={48} dur={14}>
        <PixelCard x={560} y={108} w={650} h={124} borderColor={cfg.accent} pad="22px 26px">
          <div style={{fontSize: 30, color: cfg.accent, lineHeight: 1.2}}>{cfg.name}</div>
          <div style={{fontSize: 16, color: cfg.ageColor, marginTop: 16}}>{cfg.age}</div>
        </PixelCard>
      </SlideIn>

      {cfg.traits.map((tr, idx) => {
        const y = 264 + idx * 96;
        return (
          <SlideIn key={tr.text} at={tr.at} dx={60} dur={12}>
            <PixelCard
              x={560}
              y={y}
              w={650}
              h={74}
              borderColor={cfg.accent}
              bg="rgba(20, 18, 16, 0.90)"
              pad="0 22px"
              style={{display: 'flex', alignItems: 'center'}}
            >
              <span style={{fontSize: 15, color: cfg.traitColor, lineHeight: 1.4}}>
                {cfg.traitPrefix} {tr.text}
              </span>
            </PixelCard>
          </SlideIn>
        );
      })}
    </AbsoluteFill>
  );
};

export type RuleCardConfig = {
  ruleNum: number;
  title: string;
  dur: number;
  kevinAt: number;
  mulyadiAt: number;
  kevinItems: Array<{label: string; at?: number; icon?: React.ReactNode}>;
  kevinSummary: string;
  mulyadiTitle: string;
  mulyadiLines: string[];
  mulyadiStamp: string;
};

export const RuleCardBeat: React.FC<{cfg: RuleCardConfig}> = ({cfg}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headerSpring = spring({frame: f, fps, config: {damping: 15, stiffness: 180, mass: 0.6}});
  const headerScale = interpolate(headerSpring, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill>
      <PixelMapBg plate="y1" zoomFrom={1.01} zoomTo={1.04} dim={0.56} blurPx={3} dur={cfg.dur} />

      {/* Top rule banner board */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 78,
          translate: '-50% 0',
          transform: `scale(${headerScale})`,
        }}
      >
        <PixelCard borderColor={PX.gold} pad="14px 28px">
          <div style={{fontSize: 11, color: PX.blueLight, textAlign: 'center', marginBottom: 8}}>
            ATURAN {cfg.ruleNum} DARI 3
          </div>
          <div style={{fontSize: 22, color: PX.gold, textAlign: 'center', whiteSpace: 'nowrap'}}>
            {cfg.title}
          </div>
        </PixelCard>
      </div>

      {/* Left card: KEVIN */}
      <SlideIn at={cfg.kevinAt} dx={-70} dur={14}>
        <PixelCard x={64} y={196} w={556} h={416} borderColor={PX.blueLight} pad="22px 24px">
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
            <div
              style={{
                width: 56,
                height: 64,
                background: '#222E3D',
                border: `2px solid ${PX.blueLight}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PixelSprite src="kevin_walk_0.png" w={36} h={58} />
            </div>
            <div>
              <div style={{fontSize: 18, color: PX.gold}}>KEVIN</div>
              <div style={{fontSize: 11, color: PX.blueLight, marginTop: 8}}>SINARBARU • PRO AKTIF</div>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {cfg.kevinItems.map((it, idx) => {
              const itemAt = it.at ?? cfg.kevinAt + 10 + idx * 14;
              const s = spring({
                frame: Math.max(0, f - itemAt),
                fps,
                config: {damping: 14, stiffness: 200},
              });
              return (
                <div
                  key={it.label}
                  style={{
                    opacity: f >= itemAt ? Math.min(1, s * 1.4) : 0,
                    transform: `translateX(${(1 - s) * -20}px)`,
                    background: '#20262E',
                    border: `2px solid ${PX.green}`,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    fontSize: 13,
                    color: PX.greenHi,
                  }}
                >
                  {it.icon ? (
                    it.icon
                  ) : (
                    <span style={{color: PX.green, fontSize: 16}}>&gt;</span>
                  )}
                  <span>{it.label}</span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: 20,
              fontSize: 11,
              color: PX.goldHi,
              lineHeight: 1.5,
              borderTop: '2px solid #35302B',
              paddingTop: 12,
            }}
          >
            {cfg.kevinSummary}
          </div>
        </PixelCard>
      </SlideIn>

      {/* Right card: MULYADI */}
      <SlideIn at={cfg.mulyadiAt} dx={70} dur={14}>
        <PixelCard x={660} y={196} w={556} h={416} borderColor={PX.red} pad="22px 24px">
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
            <div
              style={{
                width: 56,
                height: 64,
                background: '#38221D',
                border: `2px solid ${PX.amber}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PixelSprite src="mulyadi_walk_0.png" w={36} h={58} />
            </div>
            <div>
              <div style={{fontSize: 18, color: PX.amber}}>PAK MULYADI</div>
              <div style={{fontSize: 11, color: PX.red, marginTop: 8}}>TANJUNGSARI • NOL PERUBAHAN</div>
            </div>
          </div>

          <div
            style={{
              background: '#2B1B18',
              border: `2px solid ${PX.red}`,
              padding: '18px 18px',
              marginBottom: 18,
            }}
          >
            <div style={{fontSize: 15, color: PX.red, marginBottom: 14}}>X {cfg.mulyadiTitle}</div>
            {cfg.mulyadiLines.map((ln) => (
              <div
                key={ln}
                style={{
                  fontSize: 12,
                  color: '#FFD7CF',
                  lineHeight: 1.7,
                  marginBottom: 8,
                }}
              >
                {ln}
              </div>
            ))}
          </div>

          {/* Crisp status stamp inside Mulyadi card */}
          {f >= cfg.mulyadiAt + 28 ? (
            <div
              style={{
                marginTop: 28,
                display: 'inline-block',
                border: `3px solid ${PX.red}`,
                padding: '10px 16px',
                fontFamily: PIXEL_FONT,
                fontSize: 14,
                color: PX.red,
                background: 'rgba(20, 12, 10, 0.9)',
                transform: 'rotate(-2deg)',
              }}
            >
              {cfg.mulyadiStamp}
            </div>
          ) : null}
        </PixelCard>
      </SlideIn>

      <SparkleBurst at={cfg.kevinAt + 12} x={342} y={240} seed={`rc${cfg.ruleNum}`} spread={0.8} />
    </AbsoluteFill>
  );
};
