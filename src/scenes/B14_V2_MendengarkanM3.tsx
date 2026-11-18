import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SlideIn} from '../lib/paper/kit';
import {fullLocalF} from '../fullPlan';
import {
  PX,
  PixelBoard,
  PixelBubble,
  PixelCard,
  PixelChip,
  PixelMapBg,
  PixelSprite,
} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {VignetteStage} from '../components/VignetteStage';

const DUR = 734; // 191.52 - 216.00s

const StalkSvg: React.FC<{rich: boolean; growth: number}> = ({rich, growth}) => {
  const grains = rich ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3];
  return (
    <svg width={130} height={160} viewBox="0 0 130 160">
      {/* Stem */}
      <path
        d="M65 150 Q64 95 72 34"
        fill="none"
        stroke={rich ? PX.green : '#8BA652'}
        strokeWidth={6}
      />
      {/* Leaves */}
      <path d="M66 118 Q34 94 22 108" fill="none" stroke={rich ? PX.green : '#8BA652'} strokeWidth={5} />
      <path d="M66 96 Q98 76 112 90" fill="none" stroke={rich ? PX.green : '#8BA652'} strokeWidth={5} />
      {/* Grains */}
      {grains.map((g, idx) => {
        const show = growth > idx / grains.length;
        const side = idx % 2 === 0 ? -1 : 1;
        const gx = 70 + side * (rich ? 14 : 10) + (idx * 0.4);
        const gy = 34 + idx * (rich ? 6.5 : 13);
        return show ? (
          <ellipse
            key={g}
            cx={gx}
            cy={gy}
            rx={rich ? 9 : 6}
            ry={rich ? 5 : 4}
            fill={rich ? PX.gold : '#C7B874'}
            stroke="#241C10"
            strokeWidth={2}
          />
        ) : null;
      })}
    </svg>
  );
};

const RiceSack: React.FC<{scale?: number}> = ({scale = 1}) => (
  <svg width={56 * scale} height={64 * scale} viewBox="0 0 56 64">
    <rect x={16} y={6} width={24} height={8} fill="#C89E58" stroke="#1E140B" strokeWidth={3} />
    <rect x={8} y={14} width={40} height={44} rx={8} fill="#E0BA74" stroke="#1E140B" strokeWidth={3} />
    <rect x={14} y={24} width={28} height={22} fill="#C69D56" />
    <rect x={18} y={12} width={20} height={4} fill="#8C5E32" />
  </svg>
);

const V2Phase: React.FC<{vDur: number; youthsStart: number; bubbleAt: number}> = ({
  vDur,
  youthsStart,
  bubbleAt,
}) => {
  const vf = useCurrentFrame();
  const youthsU = interpolate(vf, [youthsStart, youthsStart + 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <VignetteStage dur={vDur} palette="day" river="normal" splitGrass>
      {/* Big Kevin listening calmly with notebook */}
      <div style={{position: 'absolute', left: 108, top: 118}}>
        <PixelSprite src="portrait_kevin_neutral.png" w={150} h={310} />
      </div>
      <PixelChip
        text="KEVIN • MENDENGARKAN!"
        x={183}
        y={438}
        centerX
        borderColor={PX.gold}
        fontSize={12}
      />
      <PixelChip
        text="TIDAK MEMBELA DIRI"
        x={183}
        y={74}
        centerX
        borderColor={PX.blueLight}
        color={PX.blueLight}
        fontSize={11}
      />

      {/* Pump + signboard */}
      <div style={{position: 'absolute', left: 428, top: 274}}>
        <PixelSprite src="pump.png" w={164} h={150} />
      </div>
      <PixelBoard title="POMPA AIR" x={510} y={436} w={210} accent={PX.gold} />

      {/* Complaining villager on right */}
      <div style={{position: 'absolute', left: 950, top: 256}}>
        <PixelSprite
          src="villager_red_walk_0.png"
          w={92}
          h={148}
          flipX
          style={{filter: 'brightness(0.18) contrast(1.4)'}}
        />
      </div>
      <PixelBubble
        text="POMPANYA RUSAK TERUS!"
        x={740}
        y={114}
        maxW={420}
        tail="bottom-right"
        at={bubbleAt}
      />

      {/* 5 youth silhouettes walking toward pump with wrenches */}
      {vf >= youthsStart ? (
        <div
          style={{
            position: 'absolute',
            left: interpolate(youthsU, [0, 1], [1080, 590]),
            top: 304,
            display: 'flex',
            gap: 18,
          }}
        >
          {[0, 1, 2, 3, 4].map((idx) => {
            const step = Math.floor((vf + idx * 3) / 6) % 4;
            return (
              <div key={idx} style={{position: 'relative'}}>
                <PixelSprite
                  src={`villager_blue_walk_${step}.png`}
                  w={62}
                  h={100}
                  flipX
                  style={{filter: 'brightness(0.22) contrast(1.3)'}}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 4,
                    top: 34,
                    width: 14,
                    height: 6,
                    background: '#C8D4E2',
                    border: '1px solid #000',
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </VignetteStage>
  );
};

const M3Phase: React.FC<{dur: number}> = ({dur}) => {
  const mf = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grainGrowth = interpolate(mf, [40, 95], [0.2, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const harvestS = spring({
    frame: Math.max(0, mf - 95),
    fps,
    config: {damping: 12, stiffness: 200},
  });

  return (
    <AbsoluteFill>
      <PixelMapBg plate="y2" zoomFrom={1.0} zoomTo={1.04} dim={0.58} blurPx={3} dur={dur} />

      <PixelChip
        text="M3 • SATU TANGKAI, DUA KARUNG"
        x={640}
        y={72}
        centerX
        borderColor={PX.gold}
        fontSize={14}
      />

      {/* Left: BIBIT BIASA */}
      <PixelCard x={84} y={136} w={524} h={492} borderColor={PX.green} pad="22px 26px">
        <div style={{fontSize: 16, color: PX.green, textAlign: 'center'}}>BIBIT BIASA</div>
        <div style={{fontSize: 11, color: PX.white, textAlign: 'center', marginTop: 10}}>
          TANGKAI STANDAR
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 28}}>
          <StalkSvg rich={false} growth={grainGrowth} />
        </div>
        <div
          style={{
            marginTop: 26,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            opacity: mf >= 95 ? harvestS : 0.25,
            transform: `scale(${mf >= 95 ? interpolate(harvestS, [0, 1], [0.7, 1]) : 0.9})`,
          }}
        >
          <RiceSack scale={1.15} />
        </div>
        <div style={{fontSize: 12, color: PX.greenHi, textAlign: 'center', marginTop: 18}}>
          HASIL PANEN BIASA
        </div>
      </PixelCard>

      {/* Right: BIBIT UNGGUL */}
      <PixelCard x={672} y={136} w={524} h={492} borderColor={PX.gold} pad="22px 26px">
        <div style={{fontSize: 16, color: PX.gold, textAlign: 'center'}}>BIBIT UNGGUL</div>
        <div style={{fontSize: 11, color: PX.white, textAlign: 'center', marginTop: 10}}>
          BULIR BERNAS & LEBAT
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 28}}>
          <StalkSvg rich growth={grainGrowth} />
        </div>
        <div
          style={{
            marginTop: 26,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 24,
            opacity: mf >= 95 ? harvestS : 0.25,
            transform: `scale(${mf >= 95 ? interpolate(harvestS, [0, 1], [0.7, 1]) : 0.9})`,
          }}
        >
          <RiceSack scale={1.15} />
          <RiceSack scale={1.15} />
        </div>
        <div style={{fontSize: 12, color: PX.goldHi, textAlign: 'center', marginTop: 18}}>
          PANEN BERLIPAT GANDA
        </div>
      </PixelCard>

      {/* Center "x2" badge (explicitly allowed by Brief §9) */}
      {mf >= 100 ? (
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: 380,
            translate: '-50% -50%',
            transform: `scale(${harvestS})`,
            background: '#261D10',
            border: `4px solid ${PX.gold}`,
            boxShadow: '5px 5px 0 rgba(0,0,0,0.7)',
            padding: '16px 22px',
            fontSize: 28,
            color: PX.gold,
          }}
        >
          x2
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const B14_V2_MendengarkanM3: React.FC = () => {
  const f = useCurrentFrame();

  const v2Start = fullLocalF('B14', 195.18);
  const v2End = fullLocalF('B14', 207.4);
  const m3Start = fullLocalF('B14', 210.46);
  const youthsStart = fullLocalF('B14', 204.46) - v2Start;
  const bubbleAt = fullLocalF('B14', 197.0) - v2Start;

  if (f >= v2Start && f < v2End) {
    return (
      <Sequence from={v2Start} durationInFrames={v2End - v2Start}>
        <V2Phase vDur={v2End - v2Start} youthsStart={youthsStart} bubbleAt={bubbleAt} />
      </Sequence>
    );
  }

  if (f >= m3Start) {
    return (
      <Sequence from={m3Start} durationInFrames={DUR - m3Start}>
        <M3Phase dur={DUR - m3Start} />
      </Sequence>
    );
  }

  // Live map intro (191.52..195.18) & breather (207.40..210.46)
  return (
    <AbsoluteFill>
      <LiveMapBg
        era={f >= v2End ? 'y4' : 'y2'}
        zoomFrom={1.0}
        zoomTo={1.06}
        dim={0.14}
        dur={DUR}
      />
      {f < v2Start ? (
        <SlideIn at={4} dy={-18} dur={12}>
          <PixelChip
            text="TAHUN 3 • KEVIN MENDENGARKAN WARGA"
            x={640}
            y={74}
            centerX
            borderColor={PX.gold}
            fontSize={13}
          />
        </SlideIn>
      ) : (
        <PixelChip
          text="MASALAH SELESAI DI AKARNYA"
          x={640}
          y={74}
          centerX
          borderColor={PX.green}
          color={PX.greenHi}
          fontSize={13}
        />
      )}
    </AbsoluteFill>
  );
};
