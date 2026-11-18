import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useCount} from '../lib/ui/ui';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelSprite, PixelStamp} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';

const DUR = 812; // 280.30 - 307.38s

export const B19_Checkpoint60_Tahun7: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scoreAt = fullLocalF('B19', 290.12); // "Index tahun keenam 60 lawan 44"
  const y7At = fullLocalF('B19', 293.8); // "Tahun ketujuh, Sari..."
  const caughtAt = fullLocalF('B19', 304.32); // "Sampai suatu sore, ayahnya memergokinya"

  const sinScore = Math.round(useCount(scoreAt, 55, 60, 46));
  const tanScore = Math.round(useCount(scoreAt + 8, 55, 44, 40));

  const cardS = spring({
    frame: Math.max(0, f - (scoreAt - 18)),
    fps,
    config: {damping: 14, stiffness: 180},
  });

  // Remittance packet flying from Ujang (Sinarbaru) to Ibu (Tanjungsari) before Year 6 score
  const remitU = ((f % 75) / 75);
  const remitX = interpolate(remitU, [0, 1], [410, 930]);
  const remitY = 300 - Math.sin(remitU * Math.PI) * 54;

  const isY7 = f >= y7At;

  return (
    <AbsoluteFill>
      <LiveMapBg
        era="y6"
        zoomFrom={isY7 ? 1.12 : 1.0}
        zoomTo={isY7 ? 1.24 : 1.05}
        panX={isY7 ? [0, 140] : [0, 0]}
        dim={0.15}
        dur={DUR}
        hideIds={isY7 ? ['sari', 'mulyadi'] : []}
        extraWalkers={
          isY7
            ? [
                {
                  id: 'sari_sneak',
                  sprite: 'sari',
                  path: [
                    [780, 316],
                    [780, 396],
                    [680, 396],
                    [666, 368],
                    [614, 368],
                    [614, 396],
                    [308, 396],
                    [308, 224],
                  ],
                  speed: 62,
                  startFrame: y7At,
                  loopMode: 'once',
                  label: 'SARI',
                  labelColor: PX.amber,
                },
                {
                  id: 'mulyadi_patrol',
                  sprite: 'mulyadi',
                  path: [
                    [920, 316],
                    [780, 316],
                    [780, 396],
                    [680, 396],
                    [666, 368],
                    [614, 368],
                    [614, 396],
                    [308, 396],
                    [308, 260],
                  ],
                  speed: 78,
                  startFrame: caughtAt - 45,
                  loopMode: 'once',
                  label: 'MULYADI',
                  labelColor: PX.red,
                },
              ]
            : []
        }
      />

      {/* Remittance animation before score card */}
      {f < scoreAt - 18 ? (
        <>
          <PixelChip
            text="UJANG • MEKANIK TERBAIK"
            x={320}
            y={74}
            centerX
            borderColor={PX.gold}
            fontSize={12}
          />
          <div
            style={{
              position: 'absolute',
              left: remitX,
              top: remitY,
              background: PX.gold,
              border: '2px solid #000',
              padding: '4px 8px',
              fontSize: 9,
              color: '#1E140B',
            }}
          >
            UPAH -&gt; IBU
          </div>
        </>
      ) : null}

      {/* Score checkpoint 60 vs 44 */}
      {f >= scoreAt - 18 && f < y7At ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: Math.min(1, cardS * 1.4),
            transform: `scale(${interpolate(cardS, [0, 1], [0.92, 1])})`,
          }}
        >
          <PixelCard x={220} y={200} w={840} h={264} borderColor={PX.gold} pad="24px 32px">
            <div style={{fontSize: 15, color: PX.goldHi, textAlign: 'center'}}>
              INDEKS KEMAKMURAN — TAHUN 6
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
              <div style={{width: 210, fontSize: 14, color: PX.green}}>TANJUNGSARI</div>
              <div style={{flex: 1, height: 28, background: '#100E0C', border: `2px solid ${PX.borderDark}`}}>
                <div style={{width: `${tanScore}%`, height: '100%', background: PX.green}} />
              </div>
              <div style={{width: 72, textAlign: 'right', fontSize: 22, color: PX.green}}>{tanScore}</div>
            </div>
          </PixelCard>
        </div>
      ) : null}

      {/* Year 7 Sari sneaky tease */}
      {isY7 ? (
        <>
          <PixelChip
            text="TAHUN 7 • SARI BELAJAR DIAM-DIAM"
            x={640}
            y={74}
            centerX
            borderColor={PX.amber}
            color={PX.goldHi}
            fontSize={13}
          />
          {f >= caughtAt ? (
            <PixelStamp
              text="KEPERGOK!"
              x={640}
              y={558}
              at={caughtAt}
              color={PX.red}
              rot={-3}
              fontSize={18}
            />
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
