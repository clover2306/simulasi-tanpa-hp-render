import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {W} from '../../lib/tokens';
import {PIXEL_FONT} from '../../pixelFont';
import {PX, PixelBubble, PixelCard, PixelChip, PixelSprite} from '../../components/PixelUI';
import {Walker} from '../../components/Walker';
import {beatDur, smooth01} from '../plan';
import {DimensionLabelsBar} from '../hud';
import {ParallelMapStage} from '../map';
import {SplitWorldStage} from '../stage';
import {CheckpointBeat, RpgDialogBox} from '../cards';

export const B22_Dialog1Kertajaya: React.FC = () => {
  const f = useCurrentFrame();
  const dur = beatDur('B22'); // 360
  const childAsks = f < 96;
  const talkOpen = f >= 96 && Math.floor(f / 6) % 2 === 0;

  // Continuous smooth push-in & shifting evening warm light ("sampai satu jam")
  const pushScale = 1.04 + 0.08 * smooth01(f, 0, dur);
  const warmAlpha = 0.08 + 0.18 * smooth01(f, 96, dur);

  return (
    <SplitWorldStage
      leftBg="bg_rumah_makan.png"
      rightBg="bg_rumah_makan.png"
      splitRatio={0.74}
      leftScale={pushScale}
      leftTint={`rgba(255, 175, 70, ${warmAlpha.toFixed(4)})`}
      rightTint="rgba(22, 48, 95, 0.3)"
      leftContent={
        <>
          {/* Seated behind head of dining table so dishes remain clear */}
          <div
            style={{
              position: 'absolute',
              left: 312,
              top: 192,
              width: 188,
              height: 242,
              overflow: 'hidden',
            }}
          >
            <PixelSprite
              src={talkOpen ? 'portrait_harjo_open.png' : 'portrait_harjo_happy.png'}
              w={188}
              h={388}
            />
          </div>
          {/* Proportional attentive child (~214px) seated on right wooden chair */}
          <div style={{position: 'absolute', left: 590, top: 292, width: 144, height: 214, overflow: 'hidden'}}>
            <PixelSprite src="villager_blue_walk_0.png" w={144} h={234} flipX />
          </div>

          {!childAsks ? (
            <>
              <PixelBubble
                text="Dulu Ayah kejar layangan di pematang sawah..."
                x={64}
                y={122}
                maxW={340}
                at={106}
              />
              {f >= 215 ? (
                <PixelBubble
                  text="...lalu sore hari bikin mainan kayu bareng teman!"
                  x={498}
                  y={128}
                  maxW={340}
                  tail="bottom-right"
                  at={215}
                />
              ) : null}
            </>
          ) : null}
        </>
      }
      rightContent={
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 214,
            width: 156,
            height: 198,
            overflow: 'hidden',
          }}
        >
          <PixelSprite src="portrait_harjo_dinner_phone.png" w={156} h={322} />
        </div>
      }
    >
      {childAsks ? (
        <RpgDialogBox
          speaker="ANAK PAK HARJO"
          text='"Ayah, dulu waktu kecil, Ayah main apa?"'
          accent={PX.gold}
          x={58}
          y={506}
          w={820}
          revealProgress={smooth01(f, 8, 52)}
        />
      ) : (
        <RpgDialogBox
          speaker="PAK HARJO (KERTAJAYA)"
          text="Pak Harjo bercerita panjang sampai satu jam penuh. Anaknya terus menatap dan mendengarkan."
          accent={PX.green}
          x={58}
          y={506}
          w={820}
          revealProgress={smooth01(f, 98, 175)}
        />
      )}
    </SplitWorldStage>
  );
};

export const B23_Dialog1Mekarsari: React.FC = () => {
  const f = useCurrentFrame();
  // Camera completely static & cold on Mekarsari ("Kamera diam, dingin")
  const splitRatio = 0.26;
  const leftW = W * splitRatio;

  const phaseChildAsks = f < 64;
  const phaseHarjoShort = f >= 64 && f < 120;
  // After f=120: child bows head silently; child's dialog box NEVER appears again!
  const bowOffset = 14 * smooth01(f, 118, 138);

  return (
    <SplitWorldStage
      leftBg="bg_rumah_makan.png"
      rightBg="bg_rumah_makan.png"
      splitRatio={splitRatio}
      rightScale={1.08}
      leftTint="rgba(255, 180, 80, 0.14)"
      rightTint="rgba(18, 42, 88, 0.34)"
      leftContent={
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 204,
            width: 156,
            height: 214,
            overflow: 'hidden',
          }}
        >
          <PixelSprite src="portrait_harjo_happy.png" w={156} h={322} />
        </div>
      }
      rightContent={
        <>
          <div
            style={{
              position: 'absolute',
              left: 312,
              top: 200,
              width: 188,
              height: 236,
              overflow: 'hidden',
            }}
          >
            <PixelSprite src="portrait_harjo_dinner_phone.png" w={188} h={388} />
          </div>
          <PixelSprite src="hp_table.png" x={536} y={522} w={44} h={31} />
          {/* Proportional young child (~214px) seated on right wooden chair, bows head silently at f>=120 */}
          <div
            style={{
              position: 'absolute',
              left: 590,
              top: 292 + bowOffset,
              width: 144,
              height: 214,
              overflow: 'hidden',
            }}
          >
            <PixelSprite src="villager_blue_walk_0.png" w={144} h={234} flipX />
          </div>
        </>
      }
    >
      {phaseChildAsks ? (
        <RpgDialogBox
          speaker="ANAK PAK HARJO"
          text='"Ayah, dulu waktu kecil, Ayah main apa?"'
          accent={PX.blueLight}
          x={leftW + 46}
          y={506}
          w={840}
          revealProgress={smooth01(f, 4, 42)}
        />
      ) : phaseHarjoShort ? (
        <RpgDialogBox
          speaker="PAK HARJO (SAMBIL MELIHAT HP)"
          text='"Biasa saja, Nak... main seadanya."'
          accent="#7A94B0"
          x={leftW + 46}
          y={506}
          w={840}
          revealProgress={smooth01(f, 66, 98)}
        />
      ) : (
        /* Silent chair — child's dialog box does NOT appear again */
        <PixelChip
          text="ANAKNYA TIDAK BERTANYA LAGI."
          x={leftW + 466}
          y={584}
          centerX
          borderColor="#5A6E84"
          color="#C2D4E8"
          bg="rgba(12, 18, 26, 0.94)"
          fontSize={11}
          style={{zIndex: 48, opacity: smooth01(f, 120, 136)}}
        />
      )}
    </SplitWorldStage>
  );
};

export const B24_CheckpointY10: React.FC = () => (
  <CheckpointBeat
    year={10}
    prevK={59}
    prevM={58}
    k={66}
    m={62}
    dur={beatDur('B24')}
    marketTier={1}
  />
);

export const B25_Tebakan: React.FC = () => {
  const f = useCurrentFrame();
  const u = smooth01(f, 0, 16);
  const showCta = f >= 92;
  const ctaU = smooth01(f, 92, 108);

  return (
    <ParallelMapStage focus="dual" dimAll={0.62} marketTier={1}>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: u,
          zIndex: 47,
          pointerEvents: 'none',
        }}
      >
        <PixelCard w={920} borderColor={PX.gold} bg="rgba(18, 16, 14, 0.97)" pad="30px 38px">
          <div style={{fontSize: 12, color: PX.gold, textAlign: 'center', marginBottom: 16}}>
            CHECKPOINT TENGAH • TAHUN 10 ?
          </div>
          <div
            style={{
              fontSize: 18,
              color: PX.white,
              textAlign: 'center',
              lineHeight: 1.75,
            }}
          >
            Sepuluh tahun lagi, apakah Mekarsari bisa mengejar? Atau jurangnya makin lebar?
          </div>
          {showCta ? (
            <div style={{marginTop: 24, textAlign: 'center', opacity: ctaU}}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#2C2112',
                  border: `3px solid ${PX.gold}`,
                  padding: '10px 22px',
                  fontSize: 13,
                  color: PX.gold,
                }}
              >
                &gt; TULIS TEBAKANMU DI KOMENTAR
              </span>
            </div>
          ) : null}
        </PixelCard>
      </AbsoluteFill>
    </ParallelMapStage>
  );
};

export const B26_ScamWave: React.FC = () => {
  const f = useCurrentFrame();
  const dur = beatDur('B26'); // 407
  const scamWave = smooth01(f, 28, 280);
  const zoomU = f < dur - 55 ? smooth01(f, 12, 65) : 1 - smooth01(f, dur - 55, dur - 10);

  // Single small pixel jolt (not excessive per Brief A5)
  const shakeX = f >= 152 && f < 160 ? (f % 2 === 0 ? 4 : -4) : 0;

  const show30Warga = f >= 204;
  const trustCracked = f >= 280;

  // Three types of scam messages radiating in Mekarsari (no scammer character, no coin icons!)
  const scamTags = [
    {label: 'LINK PALSU', x: 826, y: 222, icon: 'bubble_scam.png', at: 48},
    {label: 'INVESTASI BODONG', x: 892, y: 274, icon: 'scam_envelope.png', at: 92},
    {label: 'UNDIAN PALSU', x: 836, y: 344, icon: 'bubble_scam.png', at: 136},
  ];

  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${shakeX}px)`}}>
      <ParallelMapStage
        focus="right"
        focusStrength={zoomU}
        scamWave={scamWave}
        marketTier={1}
      >
        {/* Three scam message types floating on Mekarsari side */}
        {scamTags.map((st) =>
          f >= st.at ? (
            <div
              key={st.label}
              style={{
                position: 'absolute',
                left: st.x,
                top: st.y + Math.sin(f / 6 + st.at) * 4,
                opacity: smooth01(f, st.at, st.at + 12),
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(34, 12, 12, 0.94)',
                border: `2px solid ${PX.red}`,
                padding: '5px 9px',
                zIndex: 44,
              }}
            >
              <PixelSprite src={st.icon} w={26} h={20} />
              <span style={{fontFamily: PIXEL_FONT, fontSize: 8, color: '#FFD0C8'}}>
                {st.label}
              </span>
            </div>
          ) : null,
        )}

        {/* HUD Counter "30 warga" (direct stamp, no intermediate counting, zero coin icons) */}
        {show30Warga ? (
          <PixelCard
            x={836}
            y={566}
            w={456}
            center
            borderColor={PX.red}
            bg="rgba(26, 12, 12, 0.96)"
            pad="12px 18px"
            style={{
              zIndex: 46,
              textAlign: 'center',
              opacity: smooth01(f, 204, 218),
            }}
          >
            <div style={{fontSize: 13, color: PX.red}}>30 WARGA KEHILANGAN UANG</div>
            <div style={{fontSize: 9, color: '#F4CEC6', marginTop: 6}}>
              GELOMBANG PENIPUAN • KEPERCAYAAN RUNTUH
            </div>
          </PixelCard>
        ) : null}

        {/* Cracked "hubungan" dimension icon in HUD when trust collapses */}
        {trustCracked ? <DimensionLabelsBar y={70} crackedHubungan compact /> : null}
      </ParallelMapStage>
    </div>
  );
};

export const B27_OmenMekarsari: React.FC = () => {
  const f = useCurrentFrame();
  const splitRatio = 0.28;
  const leftW = W * splitRatio;
  const rightW = W - leftW;
  const talkOpen = Math.floor(f / 7) % 2 === 0;

  // Scam bubbles brought by neighbors extinguish as Omen explains
  const cycleF = f % 190;
  const scamExtinguished = cycleF >= 115;

  return (
    <SplitWorldStage
      leftBg="bg_bengkel.png"
      rightBg="bg_toko_hp.png"
      splitRatio={splitRatio}
      leftContent={
        <div style={{position: 'absolute', left: 88, top: 236}}>
          <PixelSprite src="portrait_omen_repair_radio.png" w={164} h={338} />
        </div>
      }
      rightContent={
        <>
          <div style={{position: 'absolute', left: 648, top: 214}}>
            <PixelSprite
              src={talkOpen ? 'portrait_omen_open.png' : 'portrait_omen_neutral.png'}
              w={184}
              h={380}
              flipX
            />
          </div>

          {/* Proportional queue of adult neighbors standing on open checkered floor asking if message is safe */}
          <Walker sprite="villager_red" path={[[472, 586]]} scale={5.5} carryingPhone />
          <Walker sprite="villager_blue" path={[[332, 592]]} scale={5.3} carryingPhone />
          <Walker sprite="villager_green" path={[[196, 598]]} scale={5.1} carryingPhone />

          <PixelBubble
            text='"Bang, pesan ini aman tidak?"'
            x={224}
            y={172}
            maxW={310}
            tail="bottom-right"
            at={16}
          />

          {/* Scam bubble dims & extinguishes when Omen points it out */}
          <div
            style={{
              position: 'absolute',
              left: 548,
              top: 274,
              opacity: scamExtinguished ? 0.18 : 1,
              filter: scamExtinguished ? 'grayscale(1)' : undefined,
            }}
          >
            <PixelSprite src="bubble_scam.png" w={72} h={56} />
            {scamExtinguished ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: PIXEL_FONT,
                  fontSize: 28,
                  color: PX.red,
                }}
              >
                X
              </div>
            ) : null}
          </div>

          <PixelChip
            text="BANG OMEN MENJADI PENJELAS • MELINDUNGI WARGA"
            x={rightW / 2}
            y={602}
            centerX
            borderColor={PX.blueLight}
            color="#E4F2FF"
            fontSize={10}
            style={{zIndex: 44}}
          />
        </>
      }
    >
      <div style={{display: 'none'}}>{leftW}</div>
    </SplitWorldStage>
  );
};

export const B28_OmenKertajaya: React.FC = () => {
  const f = useCurrentFrame();
  const splitRatio = 0.72;
  const leftW = W * splitRatio;
  const talkOpen = Math.floor(f / 8) % 2 === 0;

  return (
    <SplitWorldStage
      leftBg="bg_bengkel.png"
      rightBg="bg_toko_hp.png"
      splitRatio={splitRatio}
      leftContent={
        <>
          {/* Omen teaching 3 young apprentices with radio & background bicycle (NO flashback, NO pump sprite!) */}
          <div style={{position: 'absolute', left: 142, top: 214}}>
            <PixelSprite
              src={talkOpen ? 'portrait_omen_open.png' : 'portrait_omen_happy.png'}
              w={184}
              h={380}
            />
          </div>
          <PixelSprite src="radio.png" x={346} y={376} w={84} h={70} />

          {/* 3 proportional young apprentices (~239-250px) learning on open wooden floor */}
          <Walker sprite="villager_blue" path={[[496, 588]]} scale={4.7} idleFacingLeft chatDot />
          <Walker sprite="villager_green" path={[[638, 592]]} scale={4.8} idleFacingLeft />
          <Walker sprite="villager_red" path={[[780, 596]]} scale={4.6} idleFacingLeft chatDot />

          <PixelChip
            text="MENGAJARI TIGA ANAK MUDA • ILMU DITURUNKAN"
            x={leftW / 2}
            y={602}
            centerX
            borderColor={PX.gold}
            color={PX.goldHi}
            fontSize={10}
            style={{zIndex: 44}}
          />
        </>
      }
      rightContent={
        <div style={{position: 'absolute', left: 96, top: 236}}>
          <PixelSprite src="portrait_omen_neutral.png" w={164} h={338} flipX />
        </div>
      }
    />
  );
};

export const B29_CheckpointY12: React.FC = () => (
  <CheckpointBeat
    year={12}
    prevK={66}
    prevM={62}
    k={71}
    m={64}
    dur={beatDur('B29')}
    glitchM
    marketTier={1}
    subtitle="GELOMBANG PENIPUAN ITU MAHAL HARGANYA"
  />
);

export const B30_Dialog2Omen: React.FC = () => {
  const f = useCurrentFrame();
  const splitRatio = 0.26;
  const leftW = W * splitRatio;

  // 3 sequential RPG dialog boxes; "Nah, itu jawabannya." held longer & cracks the scam bubble!
  const box1 = f >= 14 && f < 174;
  const box2 = f >= 178 && f < 316;
  const box3 = f >= 338; // dramatic pause 316..338!
  const scamCracked = f >= 372;

  const omenTalking = (f >= 178 && f < 245) || (f >= 338 && f < 410);
  const mouthOpen = omenTalking && Math.floor(f / 6) % 2 === 0;

  return (
    <SplitWorldStage
      leftBg="bg_bengkel.png"
      rightBg="bg_toko_hp.png"
      splitRatio={splitRatio}
      rightScale={1.06}
      leftContent={
        /* Kertajaya stays dimly alive at left: Omen & proportional apprentice calm without dialog */
        <>
          <div style={{position: 'absolute', left: 34, top: 242}}>
            <PixelSprite src="portrait_omen_repair_radio.png" w={152} h={314} />
          </div>
          <Walker sprite="villager_blue" path={[[238, 562]]} scale={4.2} idleFacingLeft />
        </>
      }
      rightContent={
        <>
          {/* Proportional adult neighbor standing cleanly on open checkered tile floor holding out his phone */}
          <Walker sprite="villager_red" path={[[428, 586]]} scale={5.6} />
          <PixelSprite src="hp_hand.png" x={494} y={396} w={44} h={55} />
          {scamCracked ? (
            <PixelChip
              text="> LEGA"
              x={428}
              y={246}
              centerX
              borderColor={PX.green}
              color={PX.greenHi}
              fontSize={9}
            />
          ) : null}

          {/* Fake lottery + admin fee bubble */}
          <div
            style={{
              position: 'absolute',
              left: 68,
              top: 168,
              opacity: scamCracked ? 0.72 : 1,
              background: scamCracked ? '#261818' : '#3A1212',
              border: `3px solid ${scamCracked ? '#9A4848' : PX.red}`,
              padding: '10px 14px',
              width: 280,
              boxShadow: '4px 4px 0 rgba(0,0,0,0.65)',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <PixelSprite src="bubble_scam.png" w={34} h={26} />
              <span style={{fontFamily: PIXEL_FONT, fontSize: 9, color: PX.red}}>
                MENANG UNDIAN!
              </span>
            </div>
            <div
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: 8,
                color: '#F6D6CE',
                lineHeight: 1.6,
                marginTop: 8,
              }}
            >
              Transfer dulu biaya admin sekarang!
            </div>
            {scamCracked ? (
              <svg
                width={280}
                height={76}
                style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}
              >
                <path
                  d="M120 0 L142 28 L114 48 L156 76"
                  stroke={PX.red}
                  strokeWidth={3.5}
                  fill="none"
                />
              </svg>
            ) : null}
          </div>

          {/* Bang Omen at counter */}
          <div style={{position: 'absolute', left: 648, top: 196}}>
            <PixelSprite
              src={
                mouthOpen
                  ? 'portrait_omen_open.png'
                  : scamCracked
                    ? 'portrait_omen_happy.png'
                    : 'portrait_omen_neutral.png'
              }
              w={192}
              h={396}
              flipX
            />
          </div>
        </>
      }
    >
      {box1 ? (
        <RpgDialogBox
          speaker="TETANGGA"
          text='"Bang, aku menang undian. Katanya aku harus transfer dulu biaya admin."'
          accent={PX.amber}
          x={leftW + 46}
          y={506}
          w={850}
          revealProgress={smooth01(f, 16, 86)}
        />
      ) : box2 ? (
        <RpgDialogBox
          speaker={f < 252 ? 'BANG OMEN' : 'TETANGGA'}
          text={
            f < 252
              ? '"Kamu ikut undian apa?"'
              : '"Kamu ikut undian apa?"  —  "Tidak ikut apa-apa."'
          }
          accent={PX.blueLight}
          x={leftW + 46}
          y={506}
          w={850}
          revealProgress={f < 252 ? smooth01(f, 180, 220) : 1}
        />
      ) : box3 ? (
        <RpgDialogBox
          speaker="BANG OMEN"
          text='"Nah, itu jawabannya."'
          accent={PX.green}
          x={leftW + 46}
          y={506}
          w={850}
          revealProgress={smooth01(f, 340, 372)}
        />
      ) : null}
    </SplitWorldStage>
  );
};

interface StudentSeatSpec {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  cropH: number;
  sprite: string;
  litOrder: number;
}

const B31_STUDENT_ROWS: StudentSeatSpec[] = (() => {
  const sprites = [
    'villager_blue_walk_0.png',
    'villager_green_walk_0.png',
    'villager_red_walk_0.png',
  ];
  const raw: Array<Omit<StudentSeatSpec, 'litOrder'>> = [];
  let id = 0;
  // 4 depth-proportioned seated rows across the classroom desks: 8 + 8 + 7 + 7 = 30 students
  const rowConfigs = [
    {count: 8, x0: 30, step: 82, y: 248, w: 72, h: 117, cropH: 92},
    {count: 8, x0: 24, step: 84, y: 320, w: 80, h: 130, cropH: 106},
    {count: 7, x0: 40, step: 92, y: 396, w: 88, h: 143, cropH: 118},
    {count: 7, x0: 32, step: 96, y: 466, w: 96, h: 156, cropH: 118},
  ];
  for (const rc of rowConfigs) {
    for (let c = 0; c < rc.count; c++) {
      raw.push({
        id,
        x: rc.x0 + c * rc.step,
        y: rc.y + (c % 2 === 0 ? 0 : 4),
        w: rc.w,
        h: rc.h,
        cropH: rc.cropH,
        sprite: sprites[(id + c) % sprites.length],
      });
      id++;
    }
  }
  // Light spreads outward from teacher Dika on the right (largest x -> smallest x)
  const byDist = [...raw].sort((a, b) => b.x - a.x);
  const orderMap = new Map<number, number>();
  byDist.forEach((s, idx) => orderMap.set(s.id, idx));
  return raw.map((s) => ({...s, litOrder: orderMap.get(s.id) ?? 0}));
})();

export const B31_DikaGuru: React.FC = () => {
  const f = useCurrentFrame();
  const splitRatio = 0.74;
  const leftW = W * splitRatio;

  // Light spreads from adult teacher Dika to all 30 proportional seated students one by one!
  const litCount = Math.min(30, Math.max(0, Math.floor(((f - 24) / 230) * 30)));

  return (
    <SplitWorldStage
      leftBg="bg_sekolah.png"
      rightBg="bg_toko_hp.png"
      splitRatio={splitRatio}
      leftContent={
        <>
          {/* 30 proportional students seated in 4 depth rows (134..208px) facing teacher Dika */}
          {B31_STUDENT_ROWS.map((st) => {
            const isLit = st.litOrder < litCount;
            return (
              <div
                key={st.id}
                style={{
                  position: 'absolute',
                  left: st.x,
                  top: st.y,
                  width: st.w,
                  height: st.cropH,
                  overflow: 'hidden',
                  filter: isLit
                    ? 'drop-shadow(0 -3px 0 rgba(255, 224, 130, 0.9)) brightness(1.06)'
                    : 'brightness(0.72)',
                }}
              >
                <PixelSprite src={st.sprite} w={st.w} h={st.h} />
              </div>
            );
          })}

          {/* Adult Dika teaching at blackboard on the right */}
          <div style={{position: 'absolute', left: 742, top: 184}}>
            <PixelSprite src="portrait_dika_teacher.png" w={184} h={380} flipX />
          </div>

          <PixelChip
            text="DIKA MENJADI GURU • 30 ANAK IKUT TERANGKAT"
            x={leftW / 2}
            y={602}
            centerX
            borderColor={PX.gold}
            color={PX.goldHi}
            fontSize={10}
            style={{zIndex: 44}}
          />
        </>
      }
      rightContent={
        <div style={{position: 'absolute', left: 86, top: 236}}>
          <PixelSprite src="portrait_dika_neutral.png" w={164} h={338} />
        </div>
      }
    />
  );
};

export const B32_DikaMekarsari: React.FC = () => {
  const f = useCurrentFrame();
  const splitRatio = 0.26;
  const leftW = W * splitRatio;
  const rightW = W - leftW;

  // 0..145: neat good job at HP shop; 145..285: smooth close-up pause looking at child bowed to screen (ZERO flashback! Pagar 8/9)
  const closeUp = f >= 145;
  const closeU = smooth01(f, 145, 195);
  const blink = f % 86 >= 81;
  const zoomScale = 1 + 0.14 * closeU;

  const dikaX = 616 + (574 - 616) * closeU;
  const dikaY = 212 + (176 - 212) * closeU;
  const dikaW = 184 + (216 - 184) * closeU;
  const dikaH = 380 + (446 - 380) * closeU;

  return (
    <SplitWorldStage
      leftBg="bg_sekolah.png"
      rightBg="bg_toko_hp.png"
      splitRatio={splitRatio}
      rightScale={zoomScale}
      leftContent={
        <div style={{position: 'absolute', left: 86, top: 236}}>
          <PixelSprite src="portrait_dika_teacher.png" w={164} h={338} />
        </div>
      }
      rightContent={
        <>
          {/* Adult Dika working neatly (respectable job, not failure) */}
          <div
            style={{
              position: 'absolute',
              left: dikaX,
              top: dikaY,
            }}
          >
            <PixelSprite
              src={
                blink
                  ? 'portrait_dika_blink.png'
                  : closeUp
                    ? 'portrait_dika_sad.png'
                    : 'portrait_dika_neutral.png'
              }
              w={dikaW}
              h={dikaH}
              flipX
            />
          </div>

          {/* Proportional young child (221px) standing on open checkered floor bowed to phone */}
          <div style={{position: 'absolute', left: 396, top: 368}}>
            <PixelSprite src="villager_blue_walk_0.png" w={136} h={221} />
            <PixelSprite src="hp_hand.png" x={88} y={96} w={42} h={52} />
          </div>

          {closeUp ? (
            <PixelBubble
              text="..."
              x={482}
              y={178}
              maxW={120}
              tail="bottom-right"
              at={162}
            />
          ) : null}

          <PixelChip
            text={
              closeUp
                ? 'MELIHAT ANAK MENUNDUK KE LAYAR...'
                : 'BEKERJA DI TOKO HP • PEKERJAAN BAGUS & RAPI'
            }
            x={rightW / 2}
            y={602}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
            style={{zIndex: 44}}
          />
        </>
      }
    >
      <div style={{display: 'none'}}>{leftW}</div>
    </SplitWorldStage>
  );
};

export const B33_CheckpointY14: React.FC = () => (
  <CheckpointBeat
    year={14}
    prevK={71}
    prevM={64}
    k={76}
    m={67}
    dur={beatDur('B33')}
    marketTier={1}
  />
);
