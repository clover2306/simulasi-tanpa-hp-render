import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {W, H} from '../lib/tokens';
import {useCount} from '../lib/ui/ui';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelSprite, PixelStamp} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {Walker} from '../components/Walker';

const DUR = 845; // 216.00 - 244.16s

export const B15_Checkpoint46_Tahun4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const quoteAt = fullLocalF('B15', 224.36); // "Keberuntungan semusim"
  const scoreAt = fullLocalF('B15', 229.4); // "Index 46 melawan 40"
  const splitAt = fullLocalF('B15', 235.22); // "Sawah Sinarbaru mulai hijau terang..."

  const sinScore = Math.round(useCount(scoreAt, 75, 46, 28));
  const tanScore = Math.round(useCount(scoreAt + 12, 75, 40, 34));

  const cardS = spring({
    frame: Math.max(0, f - (scoreAt - 18)),
    fps,
    config: {damping: 14, stiffness: 170},
  });

  if (f >= splitAt) {
    const sf = f - splitAt;
    const zoom = interpolate(sf, [0, DUR - splitAt], [1.0, 1.07], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <AbsoluteFill style={{backgroundColor: '#141210'}}>
        {/* Left: Sinarbaru bright green fields */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W / 2,
            height: H,
            overflow: 'hidden',
            borderRight: `4px solid ${PX.gold}`,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: W,
              height: H,
              transform: `scale(${zoom})`,
              transformOrigin: '24% 48%',
            }}
          >
            <Img
              src={staticFile('sprites/plate_clean_y4.png')}
              className="pixel-img"
              style={{
                width: W,
                height: H,
                objectFit: 'cover',
                imageRendering: 'pixelated',
              }}
            />
            <Walker sprite="villager_red" path={[[154, 198], [308, 198], [308, 122]]} speed={44} phase={0.15} />
            <Walker sprite="villager_blue" path={[[308, 224], [308, 412], [448, 412]]} speed={48} phase={0.42} />
            <Walker sprite="villager_yellow" path={[[96, 516], [285, 516], [285, 628]]} speed={46} phase={0.68} />
            <Walker sprite="kevin" path={[[308, 224], [444, 224], [444, 396]]} speed={46} phase={0.1} label="KEVIN" labelColor={PX.gold} />
          </div>
          <PixelChip text="SINARBARU • HIJAU TERANG" x={320} y={82} centerX borderColor={PX.gold} fontSize={13} />
        </div>

        {/* Right: Tanjungsari normal green fields */}
        <div
          style={{
            position: 'absolute',
            left: W / 2,
            top: 0,
            width: W / 2,
            height: H,
            overflow: 'hidden',
            borderLeft: `4px solid ${PX.green}`,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 0,
              width: W,
              height: H,
              transform: `scale(${zoom})`,
              transformOrigin: '76% 48%',
            }}
          >
            <Img
              src={staticFile('sprites/plate_clean_y4.png')}
              className="pixel-img"
              style={{
                width: W,
                height: H,
                objectFit: 'cover',
                imageRendering: 'pixelated',
              }}
            />
            <Walker sprite="villager_blue" path={[[778, 224], [1140, 224]]} speed={44} phase={0.12} />
            <Walker sprite="villager_green" path={[[980, 126], [980, 316], [1155, 316]]} speed={46} phase={0.58} />
            <Walker sprite="villager_red" path={[[785, 398], [965, 398], [965, 516]]} speed={40} phase={0.81} />
            <Walker sprite="mulyadi" path={[[876, 316], [975, 316], [1055, 316]]} speed={32} phase={0.2} label="MULYADI" labelColor={PX.green} />
          </div>
          <PixelChip text="TANJUNGSARI • HIJAU BIASA" x={320} y={82} centerX borderColor={PX.green} color={PX.greenHi} fontSize={13} />
        </div>

        <PixelChip
          text="LIHAT SAJA SAWAHNYA"
          x={640}
          y={584}
          centerX
          borderColor={PX.gold}
          bg="#161412"
          fontSize={14}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <LiveMapBg era="y4" zoomFrom={1.0} zoomTo={1.06} dim={0.18} dur={splitAt} />

      {/* Mulyadi dismissal quote stamp */}
      {f >= quoteAt && f < scoreAt - 18 ? (
        <PixelStamp
          text='"KEBERUNTUNGAN SEMUSIM"'
          x={640}
          y={150}
          at={quoteAt}
          color={PX.amber}
          rot={-2}
          fontSize={18}
        />
      ) : null}

      {/* Year 4 Score Checkpoint Card */}
      {f >= scoreAt - 18 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: Math.min(1, cardS * 1.4),
            transform: `scale(${interpolate(cardS, [0, 1], [0.92, 1])})`,
          }}
        >
          <PixelCard x={200} y={176} w={880} h={286} borderColor={PX.gold} pad="24px 32px">
            <div style={{fontSize: 15, color: PX.goldHi, textAlign: 'center'}}>
              INDEKS KEMAKMURAN — TAHUN 4
            </div>

            <div style={{marginTop: 28, display: 'flex', alignItems: 'center', gap: 18}}>
              <PixelSprite src="kevin_walk_0.png" w={32} h={52} />
              <div style={{width: 210, fontSize: 14, color: PX.gold}}>SINARBARU</div>
              <div style={{flex: 1, height: 30, background: '#100E0C', border: `2px solid ${PX.borderDark}`}}>
                <div style={{width: `${sinScore}%`, height: '100%', background: PX.gold}} />
              </div>
              <div style={{width: 72, textAlign: 'right', fontSize: 22, color: PX.gold}}>{sinScore}</div>
            </div>

            <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 18}}>
              <PixelSprite src="mulyadi_walk_0.png" w={32} h={52} flipX />
              <div style={{width: 210, fontSize: 14, color: PX.green}}>TANJUNGSARI</div>
              <div style={{flex: 1, height: 30, background: '#100E0C', border: `2px solid ${PX.borderDark}`}}>
                <div style={{width: `${tanScore}%`, height: '100%', background: PX.green}} />
              </div>
              <div style={{width: 72, textAlign: 'right', fontSize: 22, color: PX.green}}>{tanScore}</div>
            </div>
          </PixelCard>

          <PixelStamp
            text="SINARBARU MENYALIP!"
            x={640}
            y={538}
            at={scoreAt + 42}
            color={PX.gold}
            rot={-2}
            fontSize={20}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
