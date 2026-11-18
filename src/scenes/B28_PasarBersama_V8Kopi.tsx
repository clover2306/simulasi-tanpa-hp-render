import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelBoard, PixelBubble, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {VignetteStage} from '../components/VignetteStage';

const DUR = 1239; // 472.50 - 513.80s

const V8Phase: React.FC<{vDur: number; weatherAt: number}> = ({vDur, weatherAt}) => {
  const vf = useCurrentFrame();

  return (
    <VignetteStage dur={vDur} palette="warm" river="clear" splitGrass>
      {/* Background market stalls + Ujang's pump + Sari tending stall */}
      <div style={{position: 'absolute', left: 90, top: 274}}>
        <PixelSprite src="stall_red.png" w={120} h={96} />
      </div>
      <div style={{position: 'absolute', left: 224, top: 300}}>
        <PixelSprite src="pump.png" w={88} h={80} />
      </div>
      <div style={{position: 'absolute', left: 254, top: 274}}>
        <PixelSprite src="ujang_walk_0.png" w={64} h={104} />
      </div>

      <div style={{position: 'absolute', left: 1030, top: 274}}>
        <PixelSprite src="stall_blue.png" w={120} h={96} />
      </div>
      <div style={{position: 'absolute', left: 950, top: 274}}>
        <PixelSprite src="sari_walk_0.png" w={64} h={104} flipX />
      </div>

      <PixelBoard title="PASAR BERSAMA" x={640} y={18} w={310} accent={PX.gold} />

      {/* Kevin & Mulyadi seated at small table in center */}
      <div style={{position: 'absolute', left: 340, top: 132}}>
        <PixelSprite src="portrait_kevin_happy.png" w={138} h={285} />
      </div>
      <div style={{position: 'absolute', left: 800, top: 132}}>
        <PixelSprite src="portrait_mulyadi_neutral.png" w={138} h={285} flipX />
      </div>

      {/* Small wooden coffee table */}
      <div
        style={{
          position: 'absolute',
          left: 556,
          top: 326,
          width: 168,
          height: 22,
          background: '#6E4523',
          border: '3px solid #241408',
        }}
      />
      <div style={{position: 'absolute', left: 578, top: 348, width: 16, height: 68, background: '#4F3017', border: '2px solid #241408'}} />
      <div style={{position: 'absolute', left: 686, top: 348, width: 16, height: 68, background: '#4F3017', border: '2px solid #241408'}} />

      {/* Two steaming coffee cups */}
      {[594, 660].map((cx, i) => {
        const steamY = ((vf + i * 12) % 30) / 30;
        return (
          <React.Fragment key={cx}>
            <div
              style={{
                position: 'absolute',
                left: cx,
                top: 306,
                width: 24,
                height: 20,
                background: '#F4ECE0',
                border: '2px solid #1E1814',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: cx + 6 + Math.sin(steamY * 6) * 4,
                top: 294 - steamY * 24,
                width: 8,
                height: 8,
                background: '#FFF8EC',
                opacity: (1 - steamY) * 0.75,
              }}
            />
          </React.Fragment>
        );
      })}

      <PixelChip
        text="KEVIN & PAK MULYADI • SEMEJA!"
        x={640}
        y={438}
        centerX
        borderColor={PX.gold}
        fontSize={12}
      />

      {/* Weather chat bubble */}
      <PixelBubble
        text="CUACA HARI INI CERAH YA..."
        x={455}
        y={96}
        maxW={370}
        tail="bottom-center"
        at={weatherAt}
      />
    </VignetteStage>
  );
};

export const B28_PasarBersama_V8Kopi: React.FC = () => {
  const f = useCurrentFrame();

  const marketYearAt = fullLocalF('B28', 489.42);
  const v8Start = fullLocalF('B28', 497.4);
  const v8End = fullLocalF('B28', 507.9);

  if (f >= v8Start && f < v8End) {
    return (
      <Sequence from={v8Start} durationInFrames={v8End - v8Start}>
        <V8Phase vDur={v8End - v8Start} weatherAt={fullLocalF('B28', 506.0) - v8Start} />
      </Sequence>
    );
  }

  const isMarket = f >= marketYearAt;
  const seedAt = fullLocalF('B28', 481.5);
  const bannerAt = fullLocalF('B28', 490.0);

  return (
    <AbsoluteFill>
      <LiveMapBg
        era={isMarket ? 'y16' : 'y13'}
        zoomFrom={isMarket ? 1.15 : 1.02}
        zoomTo={isMarket ? 1.25 : 1.08}
        dim={0.16}
        dur={DUR}
        extraWalkers={[
          {
            id: 'teacher_cross',
            sprite: 'villager_blue',
            path: [[444, 396], [614, 396], [614, 368], [666, 368], [680, 396], [860, 396], [860, 316], [960, 316]],
            speed: 58,
            startFrame: 60,
            loopMode: 'pingpong',
            label: 'GURU',
            labelColor: PX.blueLight,
          },
        ]}
      />

      {f < marketYearAt ? (
        <PixelCard x={360} y={84} w={560} borderColor={PX.gold} pad="14px 20px">
          <div style={{fontSize: 12, color: PX.gold, textAlign: 'center'}}>
            {f >= seedAt ? 'KIRIM BIBIT, BUKAN CERAMAH' : 'KIRIM GURU, BUKAN PERINTAH'}
          </div>
          <div style={{fontSize: 10, color: PX.greenHi, textAlign: 'center', marginTop: 10}}>
            TANJUNGSARI TUMBUH DARI FONDASI NYATA
          </div>
        </PixelCard>
      ) : null}

      {f >= bannerAt && f < v8Start ? (
        <PixelChip
          text="TAHUN 16 • PASAR BERSAMA"
          x={640}
          y={76}
          centerX
          borderColor={PX.gold}
          fontSize={14}
        />
      ) : null}

      {f >= v8End ? (
        <PixelChip
          text="DUA KEPALA DESA SALING MENGERTI"
          x={640}
          y={76}
          centerX
          borderColor={PX.gold}
          style={{
            opacity: interpolate(f, [v8End, v8End + 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
          fontSize={13}
        />
      ) : null}
    </AbsoluteFill>
  );
};
