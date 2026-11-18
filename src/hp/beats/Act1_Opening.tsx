import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {W, H} from '../../lib/tokens';
import {PIXEL_FONT} from '../../pixelFont';
import {PX, PixelBubble, PixelCard, PixelChip, PixelSprite} from '../../components/PixelUI';
import {Walker} from '../../components/Walker';
import {beatDur, pxSnap, step01} from '../plan';
import {DimensionLabelsBar} from '../hud';
import {ParallelMapStage} from '../map';
import {SplitWorldStage} from '../stage';
import {CharacterHeaderCard} from '../cards';

export const B01_Premis: React.FC = () => {
  const f = useCurrentFrame();
  // Stepped pixel ground reveal from dark screen (0..42f)
  const emergeCols = Math.min(16, Math.floor((f / 38) * 16));
  const emergeW = emergeCols * (W / 16);

  // Camera zooms Kertajaya (255..455f), then Mekarsari (455..625f), then dual
  let focus: 'dual' | 'left' | 'right' = 'dual';
  let strength = 0;
  if (f >= 255 && f < 455) {
    focus = 'left';
    strength = f < 425 ? step01(f, 255, 290, 6) : 1 - step01(f, 425, 455, 6);
  } else if (f >= 455 && f < 630) {
    focus = 'right';
    strength = f < 598 ? step01(f, 455, 490, 6) : 1 - step01(f, 598, 630, 6);
  }

  const showMekarsariRule = f >= 460;
  const hpBlinkOnK = f >= 272 && f < 398 && (f < 332 ? Math.floor(f / 6) % 2 === 0 : true);
  const hpCrossedOnK = f >= 325 && f < 410;

  return (
    <AbsoluteFill style={{backgroundColor: PX.bgDark}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: f < 42 ? emergeW : W,
          height: H,
          overflow: 'hidden',
        }}
      >
        <ParallelMapStage
          focus={focus}
          focusStrength={strength}
          showMekarsariTower={showMekarsariRule}
          mekarsariHasPhones={showMekarsariRule}
          cleanMekarsariBubbles={!showMekarsariRule}
        >
          {/* Village Name Banners (no scores — Pagar 3) */}
          <PixelChip
            text="DESA KIRI: KERTAJAYA"
            x={320}
            y={68}
            centerX
            borderColor={PX.gold}
            color={PX.gold}
            fontSize={12}
          />
          <PixelChip
            text="DESA KANAN: MEKARSARI"
            x={960}
            y={68}
            centerX
            borderColor={PX.blueLight}
            color={PX.blueLight}
            fontSize={12}
          />

          {f >= 55 && f < 245 ? (
            <PixelChip
              text="DESA SAMA • ORANG SAMA • NASIB ACAK SAMA"
              x={W / 2}
              y={594}
              centerX
              borderColor={PX.gold}
              color={PX.goldHi}
              fontSize={11}
            />
          ) : null}

          {/* Kertajaya Rule: HP blinks, gets crossed out with X, vanishes */}
          {hpBlinkOnK ? (
            <div
              style={{
                position: 'absolute',
                left: 340,
                top: 320,
                translate: '-50% -50%',
                background: 'rgba(20, 16, 14, 0.94)',
                border: `3px solid ${PX.red}`,
                padding: '16px 22px',
                zIndex: 44,
              }}
            >
              <PixelSprite src="hp_hand.png" w={56} h={70} />
              {hpCrossedOnK ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: PIXEL_FONT,
                    fontSize: 48,
                    color: PX.red,
                    textShadow: '3px 3px 0 #000',
                  }}
                >
                  X
                </div>
              ) : null}
            </div>
          ) : null}

          {f >= 280 && f < 452 ? (
            <PixelCard
              x={360}
              y={548}
              w={560}
              center
              borderColor={PX.red}
              bg="rgba(22, 16, 14, 0.95)"
              pad="12px 18px"
              style={{zIndex: 45, textAlign: 'center'}}
            >
              <div style={{fontSize: 13, color: PX.gold}}>ATURAN KERTAJAYA: HP DILARANG TOTAL</div>
              <div style={{fontSize: 9, color: '#E8C8C0', marginTop: 8}}>
                X TIDAK ADA HP • X TIDAK ADA SINYAL
              </div>
            </PixelCard>
          ) : null}

          {/* Mekarsari Rule: Signal tower stands & HP free */}
          {f >= 468 && f < 640 ? (
            <PixelCard
              x={900}
              y={548}
              w={580}
              center
              borderColor={PX.blueLight}
              bg="rgba(14, 22, 32, 0.95)"
              pad="12px 18px"
              style={{zIndex: 45, textAlign: 'center'}}
            >
              <div style={{fontSize: 13, color: PX.blueLight}}>
                ATURAN MEKARSARI: HP BEBAS TANPA BATAS
              </div>
              <div style={{fontSize: 9, color: '#D6EEFF', marginTop: 8}}>
                &gt; MENARA SINYAL AKTIF • &gt; HP DI SETIAP TANGAN
              </div>
            </PixelCard>
          ) : null}
        </ParallelMapStage>
      </div>
    </AbsoluteFill>
  );
};

export const B02_Pertanyaan: React.FC = () => {
  const f = useCurrentFrame();
  const u = step01(f, 0, 14, 6);

  return (
    <ParallelMapStage focus="dual" dimAll={0.6}>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: u,
          zIndex: 46,
          pointerEvents: 'none',
        }}
      >
        <PixelCard w={920} borderColor={PX.gold} bg="rgba(18, 16, 14, 0.96)" pad="34px 42px">
          <div style={{fontSize: 11, color: PX.gold, textAlign: 'center', marginBottom: 18}}>
            PERTANYAAN YANG DITANAM
          </div>
          <div
            style={{
              fontSize: 20,
              color: PX.white,
              textAlign: 'center',
              lineHeight: 1.75,
            }}
          >
            Kalau HP dihapus dari hidupmu, hidupmu lebih baik — atau justru lebih sulit?
          </div>
        </PixelCard>
      </AbsoluteFill>
    </ParallelMapStage>
  );
};

export const B03_Dimensi: React.FC = () => {
  const f = useCurrentFrame();
  const u = step01(f, 0, 12, 6);

  return (
    <ParallelMapStage focus="dual" dimAll={0.38}>
      <div style={{opacity: u}}>
        <PixelCard
          x={W / 2}
          y={162}
          w={760}
          center
          borderColor={PX.gold}
          bg="rgba(18, 16, 14, 0.95)"
          pad="18px 26px"
          style={{zIndex: 45, textAlign: 'center'}}
        >
          <div style={{fontSize: 18, color: PX.gold}}>DUA DESA • DUA PULUH TAHUN</div>
          <div style={{fontSize: 10, color: '#D6CCB8', marginTop: 10}}>
            RENTANG SIMULASI: TAHUN 0 SAMPAI TAHUN 20
          </div>
        </PixelCard>

        {/* Four dimension icons strictly as LABELS without numbers or bars */}
        <DimensionLabelsBar y={292} />

        <PixelChip
          text="EMPAT DIMENSI KEMAJUAN DIHITUNG BERKALA"
          x={W / 2}
          y={416}
          centerX
          borderColor="#7A6E5D"
          color={PX.goldHi}
          fontSize={11}
          style={{zIndex: 45}}
        />
      </div>
    </ParallelMapStage>
  );
};

export const B04_IntroTebak: React.FC = () => {
  const f = useCurrentFrame();
  const cardAt = 48;
  const u = step01(f, cardAt, cardAt + 14, 6);

  const castChips = [
    {name: 'DIKA', sprite: 'dika_walk_0.png'},
    {name: 'BU ENDANG', sprite: 'endang_walk_0.png'},
    {name: 'PAK HARJO', sprite: 'harjo_walk_0.png'},
    {name: 'TIA', sprite: 'tia_walk_0.png'},
    {name: 'BANG OMEN', sprite: 'omen_walk_0.png'},
  ];

  return (
    <ParallelMapStage focus="dual" dimAll={0.46}>
      {/* Row of 5 cast silhouettes/sprites */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 136,
          translate: '-50% 0',
          display: 'flex',
          gap: 20,
          zIndex: 45,
        }}
      >
        {castChips.map((c, idx) => {
          const vis = f >= idx * 8;
          return (
            <PixelCard
              key={c.name}
              borderColor={PX.gold}
              bg="rgba(20, 18, 16, 0.94)"
              pad="12px 16px"
              style={{
                opacity: vis ? 1 : 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                width: 156,
              }}
            >
              <PixelSprite src={c.sprite} w={42} h={68} />
              <div style={{fontSize: 10, color: PX.goldHi, textAlign: 'center'}}>{c.name}</div>
              <div style={{fontSize: 12, color: PX.gold}}>[ ? ]</div>
            </PixelCard>
          );
        })}
      </div>

      {/* ONE-TIME Guess Prompt Card (appears ONLY here per Brief B4) */}
      {f >= cardAt ? (
        <PixelCard
          x={W / 2}
          y={456}
          w={880}
          center
          borderColor={PX.gold}
          bg="rgba(18, 16, 14, 0.97)"
          pad="22px 30px"
          style={{opacity: u, zIndex: 46, textAlign: 'center'}}
        >
          <div style={{fontSize: 11, color: PX.gold, marginBottom: 12}}>TEBAK DALAM HATI</div>
          <div style={{fontSize: 15, color: PX.white, lineHeight: 1.7}}>
            20 tahun lagi: lebih baik, sama saja, atau lebih buruk?
          </div>
        </PixelCard>
      ) : null}
    </ParallelMapStage>
  );
};

export const B05_Dika: React.FC = () => {
  const f = useCurrentFrame();
  const dur = beatDur('B05'); // 488
  const blink = f % 90 >= 85;

  // Zoom Kertajaya (0..175), then Mekarsari (175..340), then hold dual pause ("Kedengarannya.")
  let splitRatio = 0.5;
  if (f < 175) {
    splitRatio = 0.5 + 0.2 * step01(f, 10, 42, 6) * (1 - step01(f, 145, 175, 6));
  } else if (f < 340) {
    splitRatio = 0.5 - 0.2 * step01(f, 175, 208, 6) * (1 - step01(f, 310, 340, 6));
  }

  return (
    <SplitWorldStage
      leftBg="bg_sekolah.png"
      rightBg="bg_sekolah.png"
      splitRatio={splitRatio}
      leftContent={
        <>
          <div style={{position: 'absolute', left: '42%', top: 222, translate: '-50% 0'}}>
            <PixelSprite
              src={blink ? 'portrait_dika_blink.png' : 'portrait_dika_study.png'}
              w={188}
              h={388}
            />
          </div>
          <PixelChip
            text="BELAJAR TANPA GANGGUAN"
            x={Math.round((W * splitRatio) / 2)}
            y={588}
            centerX
            borderColor={PX.gold}
            color={PX.goldHi}
            fontSize={10}
          />
        </>
      }
      rightContent={
        <>
          <div style={{position: 'absolute', left: '52%', top: 222, translate: '-50% 0'}}>
            <PixelSprite src="portrait_dika_phone.png" w={188} h={388} />
          </div>
          <PixelSprite
            src="bubble_msg.png"
            x={Math.round((W * (1 - splitRatio)) * 0.62)}
            y={248 + pxSnap(Math.sin(f / 10) * 6, 2)}
            w={54}
            h={42}
          />
          <PixelChip
            text="HP TAK PERNAH JAUH DARI TANGAN"
            x={Math.round((W * (1 - splitRatio)) / 2)}
            y={588}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
          />
        </>
      }
    >
      <CharacterHeaderCard portrait="portrait_dika_neutral.png" name="DIKA" age={16} role="PELAJAR KELAS 2 SMA" />

      {/* Unanswered contemplative pause on "Kedengarannya." */}
      {f >= dur - 135 ? (
        <PixelCard
          x={W / 2}
          y={516}
          w={680}
          center
          borderColor={PX.gold}
          bg="rgba(18, 16, 14, 0.95)"
          pad="14px 22px"
          style={{zIndex: 47, textAlign: 'center'}}
        >
          <div style={{fontSize: 13, color: PX.goldHi}}>
            &ldquo;Kedengarannya...&rdquo; &nbsp; [ ? ]
          </div>
        </PixelCard>
      ) : null}
    </SplitWorldStage>
  );
};

export const B06_Endang: React.FC = () => {
  const f = useCurrentFrame();
  let splitRatio = 0.5;
  if (f < 165) {
    splitRatio = 0.5 + 0.18 * step01(f, 8, 36, 6) * (1 - step01(f, 138, 165, 6));
  } else {
    splitRatio = 0.5 - 0.18 * step01(f, 165, 195, 6);
  }
  const leftW = pxSnap(W * splitRatio, 4);
  const rightW = W - leftW;

  return (
    <SplitWorldStage
      leftBg="bg_pasar.png"
      rightBg="bg_pasar.png"
      splitRatio={splitRatio}
      leftContent={
        <>
          <div style={{position: 'absolute', left: Math.round(leftW * 0.24), top: 234}}>
            <PixelSprite src="portrait_endang_serve.png" w={172} h={355} />
          </div>
          {/* Neighbor chatting word-of-mouth on dirt path */}
          <Walker
            sprite="villager_green"
            path={[[Math.round(leftW * 0.72), 576]]}
            scale={1.55}
            idleFacingLeft
          />
          <PixelBubble
            text="Sayurnya segar, Bu!"
            x={18}
            y={184}
            maxW={Math.min(220, leftW - 44)}
            tail="bottom-left"
            at={16}
          />
          <PixelChip
            text="LAKU DARI MULUT KE MULUT"
            x={Math.round(leftW / 2)}
            y={594}
            centerX
            borderColor={PX.gold}
            fontSize={10}
          />
        </>
      }
      rightContent={
        <>
          <PixelSprite src="signal_tower.png" x={Math.round(rightW - 96)} y={132} w={56} h={90} />
          <div style={{position: 'absolute', left: Math.round(rightW * 0.24), top: 234}}>
            <PixelSprite src="portrait_endang_photo.png" w={172} h={355} />
          </div>
          <PixelSprite src="basket_goods.png" x={Math.round(rightW * 0.52)} y={536} w={68} h={62} />
          {/* Order bubbles via signal tower + buyer entering strictly from outer right edge (Pagar 12) */}
          <PixelSprite
            src="bubble_msg.png"
            x={Math.round(rightW - 150 - ((f * 2) % 140))}
            y={210}
            w={48}
            h={38}
          />
          <Walker
            sprite="villager_blue"
            path={[
              [rightW - 24, 578],
              [Math.round(rightW * 0.68), 578],
            ]}
            speed={42}
            startFrame={150}
            loopMode="once"
            scale={1.5}
            idleFacingLeft
            carryingPhone
          />
          <PixelChip
            text="JUALAN LEWAT HP • PESANAN LUAR DESA"
            x={Math.round(rightW / 2)}
            y={594}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
          />
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_endang_neutral.png"
        name="BU ENDANG"
        age={50}
        role="PEDAGANG PASAR"
      />
    </SplitWorldStage>
  );
};

export const B07_Harjo: React.FC = () => {
  const f = useCurrentFrame();
  const talkOpen = Math.floor(f / 7) % 2 === 0;

  return (
    <SplitWorldStage
      leftBg="bg_rumah_makan.png"
      rightBg="bg_rumah_makan.png"
      splitRatio={0.5}
      leftTint="rgba(255, 190, 95, 0.08)"
      rightTint="rgba(30, 65, 120, 0.24)"
      leftContent={
        <>
          {/* Seated behind the head of the dining table so dishes stay unobstructed */}
          <div
            style={{
              position: 'absolute',
              left: 162,
              top: 196,
              width: 176,
              height: 238,
              overflow: 'hidden',
            }}
          >
            <PixelSprite
              src={talkOpen ? 'portrait_harjo_happy.png' : 'portrait_harjo_open.png'}
              w={176}
              h={364}
            />
          </div>
          {/* Two young dark-haired children seated on left & right wooden chairs */}
          <div style={{position: 'absolute', left: 26, top: 382, width: 64, height: 84, overflow: 'hidden'}}>
            <PixelSprite src="villager_green_walk_0.png" w={56} h={91} />
          </div>
          <div style={{position: 'absolute', left: 422, top: 366, width: 64, height: 80, overflow: 'hidden'}}>
            <PixelSprite src="villager_blue_walk_0.png" w={56} h={91} flipX />
          </div>
          <PixelChip
            text="MALAM MILIK ANAK-ANAKNYA"
            x={320}
            y={590}
            centerX
            borderColor={PX.gold}
            fontSize={10}
          />
        </>
      }
      rightContent={
        <>
          {/* Cropped cleanly right below the phone bezel (height=227) so built-in sprite plate never leaks */}
          <div
            style={{
              position: 'absolute',
              left: 162,
              top: 206,
              width: 176,
              height: 227,
              overflow: 'hidden',
            }}
          >
            <PixelSprite src="portrait_harjo_dinner_phone.png" w={176} h={364} />
          </div>
          <div style={{position: 'absolute', left: 26, top: 382}}>
            <div style={{width: 64, height: 84, overflow: 'hidden'}}>
              <PixelSprite src="villager_green_walk_0.png" w={56} h={91} />
            </div>
            <PixelSprite src="hp_hand.png" x={38} y={40} w={22} h={28} />
          </div>
          <div style={{position: 'absolute', left: 422, top: 366}}>
            <div style={{width: 64, height: 80, overflow: 'hidden'}}>
              <PixelSprite src="villager_blue_walk_0.png" w={56} h={91} flipX />
            </div>
            <PixelSprite src="hp_hand.png" x={-4} y={38} w={22} h={28} />
          </div>
          <PixelSprite src="hp_table.png" x={408} y={522} w={40} h={28} />
          <PixelChip
            text="MALAM MILIK LAYAR"
            x={320}
            y={590}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
          />
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_harjo_neutral.png"
        name="PAK HARJO"
        age={42}
        role="AYAH DUA ANAK"
      />
    </SplitWorldStage>
  );
};

export const B08_Tia: React.FC = () => {
  const f = useCurrentFrame();
  const talkOpen = Math.floor(f / 8) % 2 === 0;

  // Cloud of message bubbles around solitary Tia in Mekarsari (ZERO other people!)
  const bubbleOffsets: Array<[number, number]> = [
    [-160, -80],
    [135, -90],
    [-190, 10],
    [165, 5],
    [-145, 95],
    [145, 90],
    [-65, -125],
    [65, -120],
  ];

  return (
    <SplitWorldStage
      leftBg="bg_desa_siang.png"
      rightBg="bg_desa_siang.png"
      splitRatio={0.5}
      leftContent={
        <>
          {/* Grounded on the green foreground meadow (y=636), never floating on treetops */}
          <div style={{position: 'absolute', left: 204, top: 290}}>
            <PixelSprite
              src={talkOpen ? 'portrait_tia_open.png' : 'portrait_tia_happy.png'}
              w={168}
              h={346}
            />
          </div>
          {/* Next-door neighbor standing on foreground meadow grass */}
          <Walker sprite="villager_red" path={[[456, 636]]} scale={1.65} idleFacingLeft chatDot />
          <PixelBubble
            text="Pagi, Tia!"
            x={390}
            y={422}
            maxW={180}
            tail="bottom-left"
            at={18}
          />
          <PixelChip
            text="TETANGGA SEBELAH • BERTEMU TIAP HARI"
            x={320}
            y={156}
            centerX
            borderColor={PX.gold}
            fontSize={10}
          />
        </>
      }
      rightContent={
        <>
          {/* Solitary Tia grounded on foreground grass: ZERO physical people near her (Brief B4d) */}
          <div style={{position: 'absolute', left: 236, top: 290}}>
            <PixelSprite src="portrait_tia_phone.png" w={168} h={346} />
          </div>
          {bubbleOffsets.map(([dx, dy], i) => {
            const bob = pxSnap(Math.sin(f / 9 + i * 1.1) * 8, 2);
            return (
              <PixelSprite
                key={i}
                src="bubble_msg.png"
                x={300 + dx}
                y={396 + dy + bob}
                w={44}
                h={34}
              />
            );
          })}
          {/* Small HUD counter for 800 friends (allowed narration number) */}
          <PixelChip
            text="800 TEMAN • TAK SATU PUN DITEMUI"
            x={320}
            y={156}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
          />
        </>
      }
    >
      <CharacterHeaderCard portrait="portrait_tia_neutral.png" name="TIA" age={19} role="WARGA MUDA" />
    </SplitWorldStage>
  );
};

export const B09_Omen: React.FC = () => {
  const f = useCurrentFrame();
  const showDualRuleCard = f >= 290;

  return (
    <SplitWorldStage
      leftBg="bg_bengkel.png"
      rightBg="bg_toko_hp.png"
      splitRatio={0.5}
      leftContent={
        <>
          <div style={{position: 'absolute', left: 232, top: 236}}>
            <PixelSprite src="portrait_omen_sad.png" w={172} h={355} />
          </div>
          <PixelChip
            text="BENGKEL SEPI • TIDAK ADA HP SAMA SEKALI"
            x={320}
            y={590}
            centerX
            borderColor={PX.amber}
            color={PX.amber}
            fontSize={9}
          />
        </>
      }
      rightContent={
        <>
          <div style={{position: 'absolute', left: 374, top: 232}}>
            <PixelSprite src="portrait_omen_repair_hp.png" w={172} h={355} flipX />
          </div>
          {/* Phones resting directly on the wooden repair desk surface */}
          <PixelSprite src="hp_pile.png" x={516} y={380} w={74} h={56} />
          <PixelSprite src="hp_broken.png" x={586} y={384} w={40} h={46} />
          {/* Customers standing on open checkered floor */}
          <Walker sprite="villager_blue" path={[[306, 566]]} scale={1.6} carryingPhone />
          <Walker sprite="villager_green" path={[[252, 574]]} scale={1.55} carryingPhone />
          <PixelChip
            text="TOKO HP TIDAK PERNAH SEPI"
            x={320}
            y={590}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
          />
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_omen_neutral.png"
        name="BANG OMEN"
        age={38}
        role="TUKANG SERVIS HP"
      />

      {/* Two-sided rule reflection card */}
      {showDualRuleCard ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 472,
            translate: '-50% 0',
            display: 'flex',
            zIndex: 49,
            boxShadow: '6px 6px 0 rgba(0,0,0,0.75)',
          }}
        >
          <PixelCard
            w={410}
            borderColor={PX.red}
            bg="rgba(28, 16, 14, 0.96)"
            pad="14px 18px"
            style={{textAlign: 'center'}}
          >
            <div style={{fontSize: 12, color: PX.red}}>BENCANA BUAT SATU ORANG</div>
            <div style={{fontSize: 9, color: '#F0D0C8', marginTop: 8}}>
              ATURAN YANG SAMA DI KERTAJAYA
            </div>
          </PixelCard>
          <PixelCard
            w={410}
            borderColor={PX.green}
            bg="rgba(14, 26, 20, 0.96)"
            pad="14px 18px"
            style={{textAlign: 'center'}}
          >
            <div style={{fontSize: 12, color: PX.green}}>BERKAH BUAT ORANG LAIN</div>
            <div style={{fontSize: 9, color: '#D0F6DC', marginTop: 8}}>
              ATURAN YANG SAMA DI MEKARSARI
            </div>
          </PixelCard>
        </div>
      ) : null}
    </SplitWorldStage>
  );
};

export const B10_SimpanMulai: React.FC = () => {
  const f = useCurrentFrame();
  // Seal at f=70, dock to HUD corner at f=118..188, start Year 1 at f=208 (124.48s)
  const dockU = step01(f, 118, 188, 10);
  const startYear1 = f >= 204;

  const cardX = pxSnap(640 + (730 - 640) * dockU, 4);
  const cardY = pxSnap(340 + (28 - 340) * dockU, 4);
  const cardScale = 1 - 0.82 * dockU;

  return (
    <ParallelMapStage focus="dual" dimAll={startYear1 ? 0.14 : 0.45}>
      {dockU < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: cardX,
            top: cardY,
            translate: '-50% -50%',
            transform: `scale(${cardScale.toFixed(2)})`,
            zIndex: 47,
          }}
        >
          <PixelCard w={840} borderColor={PX.gold} bg="rgba(18, 16, 14, 0.97)" pad="26px 34px">
            <div style={{fontSize: 10, color: PX.gold, textAlign: 'center', marginBottom: 14}}>
              DISIMPAN SAMPAI AKHIR SIMULASI
            </div>
            <div style={{fontSize: 17, color: PX.white, textAlign: 'center', lineHeight: 1.7}}>
              Yang tanpa HP lebih bahagia, atau justru tertinggal?
            </div>
            {f >= 58 ? (
              <div style={{marginTop: 18, textAlign: 'center'}}>
                <span
                  style={{
                    display: 'inline-block',
                    background: '#2C2012',
                    border: `3px solid ${PX.gold}`,
                    padding: '6px 14px',
                    fontSize: 12,
                    color: PX.gold,
                  }}
                >
                  [ DISEGEL ]
                </span>
              </div>
            ) : null}
          </PixelCard>
        </div>
      ) : null}

      {startYear1 ? (
        <PixelCard
          x={W / 2}
          y={558}
          w={620}
          center
          borderColor={PX.gold}
          bg="rgba(18, 16, 14, 0.95)"
          pad="14px 24px"
          style={{zIndex: 46, textAlign: 'center'}}
        >
          <div style={{fontSize: 16, color: PX.gold}}>HARI PERTAMA • TAHUN 1</div>
          <div style={{fontSize: 9, color: PX.goldHi, marginTop: 8}}>
            SIMULASI DUA PULUH TAHUN DIMULAI
          </div>
        </PixelCard>
      ) : null}
    </ParallelMapStage>
  );
};
