import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useCount} from '../lib/ui/ui';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelMapBg, PixelSprite} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';

const DUR = 631; // 451.48 - 472.50s

const M6Phase: React.FC<{mDur: number}> = ({mDur}) => {
  const mf = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pumpPulse = (mf % 20) / 20;
  const scaleS = spring({
    frame: Math.max(0, mf - 140),
    fps,
    config: {damping: 12, stiffness: 200},
  });

  return (
    <AbsoluteFill>
      <PixelMapBg plate="y2" zoomFrom={1.0} zoomTo={1.04} dim={0.6} blurPx={3} dur={mDur} />

      <PixelChip
        text="M6 • CARA KERJA POMPA"
        x={640}
        y={72}
        centerX
        borderColor={PX.gold}
        fontSize={14}
      />

      {/* Top comparison: 1 Pump vs 10 Bucket Haulers */}
      <PixelCard x={84} y={134} w={524} h={350} borderColor={PX.gold} pad="22px 24px">
        <div style={{fontSize: 15, color: PX.gold, textAlign: 'center'}}>1 POMPA AIR</div>
        <div style={{position: 'relative', height: 220, marginTop: 18, background: '#142016', border: '2px solid #355830', overflow: 'hidden'}}>
          {/* River on left */}
          <div style={{position: 'absolute', left: 0, top: 70, bottom: 0, width: 92, background: '#347EC8', borderTop: '4px solid #9CD4FA'}} />
          {/* Pipe */}
          <div style={{position: 'absolute', left: 68, top: 44, width: 12, height: 110, background: '#8F99A5', border: '2px solid #000'}} />
          <div style={{position: 'absolute', left: 68, top: 44, width: 140, height: 12, background: '#8F99A5', border: '2px solid #000'}} />
          {/* Pump */}
          <div style={{position: 'absolute', left: 170, top: 20 + (Math.floor(mf / 6) % 2) * -3}}>
            <PixelSprite src="pump.png" w={100} h={92} />
          </div>
          {/* Water flow to ditch */}
          <div style={{position: 'absolute', left: 266, right: 0, top: 82, height: 18, background: '#3490DC'}} />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 274 + ((pumpPulse + i * 0.33) % 1) * 180,
                top: 88,
                width: 22,
                height: 6,
                background: '#C4ECFF',
              }}
            />
          ))}
          <div style={{position: 'absolute', left: 266, right: 14, bottom: 16, display: 'flex', justifyContent: 'space-around'}}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{width: 26, height: 46, background: '#7CE05A', border: '2px solid #2A5C1E'}} />
            ))}
          </div>
        </div>
        <div style={{fontSize: 11, color: PX.greenHi, textAlign: 'center', marginTop: 18}}>
          MENGALIR OTOMATIS SEHARIAN
        </div>
      </PixelCard>

      <PixelCard x={672} y={134} w={524} h={350} borderColor={PX.amber} pad="22px 24px">
        <div style={{fontSize: 15, color: PX.amber, textAlign: 'center'}}>10 ORANG MENIMBA</div>
        <div
          style={{
            marginTop: 22,
            height: 216,
            background: '#1C1814',
            border: `2px solid ${PX.borderDark}`,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            placeItems: 'center',
            padding: '10px 14px',
          }}
        >
          {Array.from({length: 10}, (_, i) => {
            const step = Math.floor((mf + i * 3) / 6) % 4;
            return (
              <div key={i} style={{position: 'relative', textAlign: 'center'}}>
                <PixelSprite
                  src={`villager_yellow_walk_${step}.png`}
                  w={44}
                  h={72}
                  style={{filter: 'brightness(0.45) contrast(1.2)'}}
                />
                {/* Bucket */}
                <div
                  style={{
                    position: 'absolute',
                    right: -4,
                    bottom: 12,
                    width: 14,
                    height: 14,
                    background: '#388CD4',
                    border: '2px solid #D6B472',
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{fontSize: 11, color: PX.amber, textAlign: 'center', marginTop: 18}}>
          TENAGA MANUSIA BERDERET PANJANG
        </div>
      </PixelCard>

      {/* Bottom balanced equation chip "1 POMPA = 10 ORANG" */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 520,
          translate: '-50% 0',
          transform: `scale(${mf >= 140 ? scaleS : 0.85})`,
          opacity: mf >= 140 ? 1 : 0.45,
        }}
      >
        <PixelChip
          text="1 POMPA = 10 ORANG"
          borderColor={PX.gold}
          bg="#261D10"
          color={PX.gold}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

export const B27_M6_CaraKerjaPompa: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scoreAt = fullLocalF('B27', 456.28); // "Index 80 lawan 46"
  const m6Start = fullLocalF('B27', 459.7); // "Fun fact nih..."
  const m6End = fullLocalF('B27', 468.0);

  const sinScore = Math.round(useCount(scoreAt, 55, 80, 74));
  const tanScore = Math.round(useCount(scoreAt + 6, 55, 46, 38));

  const cardS = spring({
    frame: Math.max(0, f - (scoreAt - 18)),
    fps,
    config: {damping: 14, stiffness: 180},
  });

  if (f >= m6Start && f < m6End) {
    return (
      <Sequence from={m6Start} durationInFrames={m6End - m6Start}>
        <M6Phase mDur={m6End - m6Start} />
      </Sequence>
    );
  }

  return (
    <AbsoluteFill>
      <LiveMapBg era="y13" zoomFrom={1.04} zoomTo={1.1} dim={0.18} dur={DUR} />

      {f >= scoreAt - 18 && f < m6Start ? (
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
              INDEKS KEMAKMURAN — TAHUN 14
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

      {f >= m6End ? (
        <PixelChip
          text="SATU POMPA MEMULIHKAN SAWAH"
          x={640}
          y={76}
          centerX
          borderColor={PX.green}
          color={PX.greenHi}
          fontSize={13}
        />
      ) : null}
    </AbsoluteFill>
  );
};
