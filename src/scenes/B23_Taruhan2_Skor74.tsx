import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useCount} from '../lib/ui/ui';
import {PopIn} from '../lib/paper/kit';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelSprite, PixelStamp} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';

const DUR = 565; // 357.04 - 375.88s

export const B23_Taruhan2_Skor74: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scoreAt = fullLocalF('B23', 361.54); // "Index kemakmuran 74 lawan 38"
  const betAt = fullLocalF('B23', 367.66); // "Oke, pertanyaan kedua..."

  const sinScore = Math.round(useCount(scoreAt, 70, 74, 60));
  const tanScore = Math.round(useCount(scoreAt + 8, 70, 38, 44));

  const cardS = spring({
    frame: Math.max(0, f - (scoreAt - 18)),
    fps,
    config: {damping: 14, stiffness: 180},
  });

  if (f >= betAt) {
    const pulse = 1 + 0.06 * Math.sin(f / 9);
    return (
      <AbsoluteFill>
        <LiveMapBg era="drought" zoomFrom={1.03} zoomTo={1.08} dim={0.35} dur={DUR - betAt} />

        <PopIn at={betAt} seed="bet2">
          <PixelCard x={180} y={114} w={920} h={396} borderColor={PX.gold} pad="26px 34px">
            <div style={{textAlign: 'center'}}>
              <PixelChip text="PERTANYAAN KEDUA" borderColor={PX.amber} color={PX.amber} fontSize={12} />
            </div>
            <div style={{marginTop: 24, textAlign: 'center', fontSize: 26, color: PX.gold}}>
              BISA NYALIP ENGGAK?
            </div>

            <div
              style={{
                marginTop: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#100E0C',
                border: `2px solid ${PX.borderDark}`,
                padding: '18px 26px',
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <PixelSprite src="kevin_walk_0.png" w={38} h={62} />
                <div>
                  <div style={{fontSize: 12, color: PX.gold}}>SINARBARU</div>
                  <div style={{fontSize: 26, color: PX.gold, marginTop: 8}}>74</div>
                </div>
              </div>

              <div
                style={{
                  width: 64,
                  height: 64,
                  border: `3px solid ${PX.gold}`,
                  background: '#261D12',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 26,
                  color: PX.gold,
                  transform: `scale(${pulse.toFixed(3)})`,
                }}
              >
                ?
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: 14, textAlign: 'right'}}>
                <div>
                  <div style={{fontSize: 12, color: PX.green}}>TANJUNGSARI</div>
                  <div style={{fontSize: 26, color: PX.red, marginTop: 8}}>38</div>
                </div>
                <PixelSprite src="mulyadi_walk_0.png" w={38} h={62} flipX />
              </div>
            </div>

            <div style={{marginTop: 26, textAlign: 'center', fontSize: 12, color: PX.goldHi}}>
              JARAK SUDAH DUA KALI LIPAT • TEBAK SEKARANG!
            </div>
          </PixelCard>
        </PopIn>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <LiveMapBg era="drought" zoomFrom={1.0} zoomTo={1.06} dim={0.22} dur={betAt} />

      {f >= scoreAt - 18 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: Math.min(1, cardS * 1.4),
            transform: `scale(${interpolate(cardS, [0, 1], [0.92, 1])})`,
          }}
        >
          <PixelCard x={220} y={190} w={840} h={264} borderColor={PX.gold} pad="24px 32px">
            <div style={{fontSize: 15, color: PX.goldHi, textAlign: 'center'}}>
              INDEKS KEMAKMURAN — TAHUN 10
            </div>
            <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 18}}>
              <PixelSprite src="kevin_walk_0.png" w={32} h={52} />
              <div style={{width: 210, fontSize: 14, color: PX.gold}}>SINARBARU</div>
              <div style={{flex: 1, height: 28, background: '#100E0C', border: `2px solid ${PX.borderDark}`}}>
                <div style={{width: `${sinScore}%`, height: '100%', background: PX.gold}} />
              </div>
              <div style={{width: 72, textAlign: 'right', fontSize: 22, color: PX.gold}}>{sinScore}</div>
            </div>
            <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 18}}>
              <PixelSprite src="mulyadi_walk_0.png" w={32} h={52} flipX />
              <div style={{width: 210, fontSize: 14, color: PX.red}}>TANJUNGSARI</div>
              <div style={{flex: 1, height: 28, background: '#100E0C', border: `2px solid ${PX.borderDark}`}}>
                <div style={{width: `${tanScore}%`, height: '100%', background: PX.red}} />
              </div>
              <div style={{width: 72, textAlign: 'right', fontSize: 22, color: PX.red}}>{tanScore}</div>
            </div>
          </PixelCard>

          <PixelStamp
            text="JARAK 2x LIPAT!"
            x={640}
            y={524}
            at={scoreAt + 34}
            color={PX.amber}
            rot={-2}
            fontSize={18}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
