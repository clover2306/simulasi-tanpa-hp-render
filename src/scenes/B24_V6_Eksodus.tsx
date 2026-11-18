import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelBoard, PixelChip, PixelSprite, PixelStamp} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {VignetteStage} from '../components/VignetteStage';

const DUR = 1187; // 375.88 - 415.44s

export const B24_V6_Eksodus: React.FC = () => {
  const f = useCurrentFrame();

  const v6End = fullLocalF('B24', 390.34); // 434f
  const stampAt = fullLocalF('B24', 398.44);
  const answerAt = fullLocalF('B24', 411.2);

  if (f < v6End) {
    // V6 Vignette: Exodus across the river while Mulyadi watches alone on right
    const crossingStart = fullLocalF('B24', 384.32); // "Tahun ke-11, satu per satu keluarga..."
    const migProgress = interpolate(f, [crossingStart, v6End - 68], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    const families = [
      {sprite: 'villager_red', offset: 0},
      {sprite: 'villager_blue', offset: 0.18},
      {sprite: 'villager_yellow', offset: 0.36},
      {sprite: 'villager_green', offset: 0.54},
    ];

    return (
      <VignetteStage dur={v6End} palette="dusk" river="drought" splitGrass>
        {/* Low setting sun */}
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 210,
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: '#D97B48',
            opacity: 0.85,
          }}
        />

        {/* Background houses in Tanjungsari dimming one by one */}
        {[0, 1, 2].map((idx) => {
          const dimmed = migProgress > 0.25 + idx * 0.24;
          return (
            <div key={idx} style={{position: 'absolute', left: 740 + idx * 116, top: 278, opacity: dimmed ? 0.5 : 0.95}}>
              <PixelSprite src={dimmed ? 'house_aband.png' : 'house_thatch.png'} w={110} h={104} />
            </div>
          );
        })}

        {/* Tilted Tanjungsari gate sign */}
        <div style={{transform: 'rotate(-5deg)', transformOrigin: '800px 168px'}}>
          <PixelBoard title="TANJUNGSARI" x={800} y={168} w={230} accent={PX.amber} />
        </div>

        {/* Families streaming left across stepping stones with packs */}
        {families.map((fam, idx) => {
          const p = Math.max(0, Math.min(1, (migProgress - fam.offset) / 0.48));
          if (p <= 0 || p >= 1) return null;
          const x = interpolate(p, [0, 1], [860, 80]);
          const step = Math.floor((f + idx * 4) / 6) % 4;
          return (
            <div key={fam.sprite} style={{position: 'absolute', left: x, top: 286}}>
              <PixelSprite
                src={`${fam.sprite}_walk_${step}.png`}
                w={74}
                h={120}
                flipX
                style={{filter: 'brightness(0.22) contrast(1.4)'}}
              />
              {/* Bundle on back */}
              <div
                style={{
                  position: 'absolute',
                  right: -6,
                  top: 34,
                  width: 24,
                  height: 30,
                  background: '#8B6239',
                  border: '2px solid #1E140B',
                }}
              />
            </div>
          );
        })}

        {/* Pak Mulyadi alone at right watching them leave */}
        <div style={{position: 'absolute', left: 1020, top: 118}}>
          <PixelSprite src="portrait_mulyadi_sad.png" w={150} h={310} flipX />
        </div>
        <PixelChip
          text="PAK MULYADI • DITINGGAL!"
          x={1095}
          y={438}
          centerX
          borderColor={PX.amber}
          color={PX.amber}
          fontSize={12}
        />
      </VignetteStage>
    );
  }

  // Post-V6: Live map with exodus migrants crossing bridge + migrant counter 0->50 (gated until after V6!)
  return (
    <Sequence from={v6End} durationInFrames={DUR - v6End}>
      <PostExodusPhase v6End={v6End} mDur={DUR - v6End} stampAt={stampAt} answerAt={answerAt} />
    </Sequence>
  );
};

const PostExodusPhase: React.FC<{v6End: number; mDur: number; stampAt: number; answerAt: number}> = ({
  v6End,
  mDur,
  stampAt,
  answerAt,
}) => {
  const mf = useCurrentFrame();
  const absSec = 375.88 + (v6End + mf) / 30;
  const migrantCount = Math.round(
    interpolate(absSec, [375.88, 415.42], [0, 50], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  return (
    <AbsoluteFill>
      <LiveMapBg
        era="y12"
        zoomFrom={1.12}
        zoomTo={1.04}
        dim={0.18}
        dur={mDur}
        extraWalkers={[
          {
            id: 'exo_1',
            sprite: 'villager_red',
            path: [[820, 316], [780, 316], [780, 396], [680, 396], [666, 368], [614, 368], [614, 396], [295, 396]],
            speed: 58,
            startFrame: 0,
            loopMode: 'once',
          },
          {
            id: 'exo_2',
            sprite: 'villager_blue',
            path: [[900, 316], [780, 316], [780, 396], [680, 396], [666, 368], [614, 368], [614, 396], [308, 396], [308, 224]],
            speed: 56,
            startFrame: 36,
            loopMode: 'once',
          },
          {
            id: 'exo_3',
            sprite: 'villager_green',
            path: [[960, 316], [780, 316], [780, 396], [680, 396], [666, 368], [614, 368], [614, 396], [444, 412]],
            speed: 54,
            startFrame: 72,
            loopMode: 'once',
          },
        ]}
      />

      {/* Migrant counter under HUD left (gated during V6, shown after V6 closes) */}
      <PixelChip
        text={`KELUARGA PINDAH: ${migrantCount}`}
        x={24}
        y={64}
        borderColor={PX.gold}
        color={PX.goldHi}
        fontSize={12}
      />

      {mf >= stampAt - v6End && mf < answerAt - v6End ? (
        <PixelStamp
          text="SEPARUH WARGA PINDAH"
          x={640}
          y={136}
          at={stampAt - v6End}
          color={PX.red}
          rot={-2}
          fontSize={20}
        />
      ) : null}

      {mf >= answerAt - v6End ? (
        <PixelChip
          text="ENGGAK NYALIP, BRO — MAKIN JAUH"
          x={640}
          y={576}
          centerX
          borderColor={PX.red}
          color={PX.red}
          fontSize={14}
        />
      ) : null}
    </AbsoluteFill>
  );
};
