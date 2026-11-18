import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {W, H} from '../lib/tokens';
import {PIXEL_FONT} from '../pixelFont';
import {PX, PixelChip, PixelSprite} from './PixelUI';

export type DialogSpeaker = 'mulyadi' | 'sari';

export interface DialogLine {
  speaker: DialogSpeaker;
  fromF: number;
  toF: number;
  text: string;
}

export const DialogScene: React.FC<{
  dur: number;
  lines: DialogLine[];
  hugFromF?: number;
  mulyadiLabel?: string;
  sariLabel?: string;
  mulyadiNeutral?: boolean;
  children?: React.ReactNode;
}> = ({
  dur,
  lines,
  hugFromF,
  mulyadiLabel = 'PAK MULYADI',
  sariLabel = 'SARI',
  mulyadiNeutral = false,
  children,
}) => {
  const f = useCurrentFrame();

  const bgScale = interpolate(f, [0, dur], [1.0, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const active = lines.find((l) => f >= l.fromF && f < l.toF + 12) ?? null;
  const hugging = hugFromF !== undefined && f >= hugFromF;

  const blink = f % 100 >= 95;
  const mouthOpen = active ? Math.floor(f / 5) % 2 === 0 : false;
  const mulyadiSpeaking = active?.speaker === 'mulyadi' && !hugging;
  const sariSpeaking = active?.speaker === 'sari' && !hugging;

  const mulyadiSrc = mulyadiSpeaking && mouthOpen
    ? mulyadiNeutral
      ? 'portrait_mulyadi_neutral_open.png'
      : 'portrait_mulyadi_open.png'
    : blink
      ? 'portrait_mulyadi_blink.png'
      : mulyadiNeutral
        ? 'portrait_mulyadi_neutral.png'
        : 'portrait_mulyadi_stern.png';

  const sariSrc = hugging
    ? 'portrait_sari_happy.png'
    : sariSpeaking && mouthOpen
      ? 'portrait_sari_open.png'
      : blink
        ? 'portrait_sari_blink.png'
        : 'portrait_sari_neutral.png';

  const bobL = Math.floor(f / 16) % 2 === 0 ? 0 : 3;
  const bobR = Math.floor(f / 16) % 2 === 1 ? 0 : 3;

  const sariX = hugging
    ? interpolate(f, [hugFromF!, hugFromF! + 24], [890, 420], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 890;

  const shownText = active
    ? active.text.slice(
        0,
        Math.max(
          1,
          Math.floor(
            active.text.length *
              Math.min(1, (f - active.fromF) / Math.max(8, active.toF - active.fromF)),
          ),
        ),
      )
    : '';

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#1E1420'}}>
      <AbsoluteFill style={{transform: `scale(${bgScale.toFixed(4)})`, transformOrigin: '50% 50%'}}>
        <Img
          src={staticFile('sprites/bg_sunset.png')}
          className="pixel-img"
          style={{width: W, height: H, objectFit: 'cover', imageRendering: 'pixelated'}}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: '#160B18', opacity: 0.14, pointerEvents: 'none'}} />

      {/* Left speaker: Pak Mulyadi (y: 230..586, well above y=660 caption zone) */}
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 228 + bobL,
          opacity: active && !mulyadiSpeaking && !hugging ? 0.58 : 1,
        }}
      >
        <PixelSprite src={mulyadiSrc} w={172} h={355} />
      </div>

      {/* Right speaker: Sari */}
      <div
        style={{
          position: 'absolute',
          left: sariX,
          top: 228 + bobR,
          opacity: active && !sariSpeaking && !hugging ? 0.58 : 1,
        }}
      >
        <PixelSprite src={sariSrc} w={172} h={355} flipX />
      </div>

      {/* Nameplates kept safely above y=660 caption zone (y=594..634) */}
      <PixelChip
        text={mulyadiLabel}
        x={286}
        y={594}
        centerX
        borderColor={PX.green}
        color={PX.greenHi}
        fontSize={12}
      />
      <PixelChip
        text={sariLabel}
        x={sariX + 86}
        y={594}
        centerX
        borderColor={PX.amber}
        color={PX.goldHi}
        fontSize={12}
      />

      {/* Dialogue Bubble */}
      {active && !hugging ? (
        <div
          style={{
            position: 'absolute',
            left: active.speaker === 'mulyadi' ? 92 : undefined,
            right: active.speaker === 'sari' ? 92 : undefined,
            top: 84,
            width: 680,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: PX.bgDark,
              border: `2px solid ${active.speaker === 'mulyadi' ? PX.green : PX.amber}`,
              padding: '5px 12px',
              fontFamily: PIXEL_FONT,
              fontSize: 11,
              color: active.speaker === 'mulyadi' ? PX.green : PX.amber,
              marginBottom: -2,
              marginLeft: 16,
              position: 'relative',
              zIndex: 2,
            }}
          >
            {active.speaker === 'mulyadi' ? 'PAK MULYADI' : 'SARI'}
          </div>
          <div
            style={{
              background: '#FFFDF7',
              border: '4px solid #1E1814',
              boxShadow: '6px 6px 0 rgba(0,0,0,0.6)',
              padding: '16px 20px',
              fontFamily: PIXEL_FONT,
              fontSize: 13,
              lineHeight: 1.7,
              color: '#1E1814',
            }}
          >
            {shownText}
          </div>
        </div>
      ) : null}

      {children}
    </AbsoluteFill>
  );
};
