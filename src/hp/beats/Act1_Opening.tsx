import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {W, H} from '../../lib/tokens';
import {PIXEL_FONT} from '../../pixelFont';
import {PX, PixelBubble, PixelCard, PixelChip, PixelSprite} from '../../components/PixelUI';
import {Walker} from '../../components/Walker';
import {beatDur, smooth01} from '../plan';
import {DimensionLabelsBar} from '../hud';
import {ParallelMapStage} from '../map';
import {SplitWorldStage} from '../stage';
import {CharacterHeaderCard} from '../cards';

export const B01_Premis: React.FC = () => {
  const f = useCurrentFrame();
  const dur = beatDur('B01'); // 679
  // Stepped pixel ground reveal from dark screen (0..42f)
  const emergeCols = Math.min(16, Math.floor((f / 38) * 16));
  const emergeW = emergeCols * (W / 16);

  // Leader-style calm opening: fixed dual frame (no sideways pan), continuous slow zoom creep,
  // and soft spotlight dimming when Kertajaya (255..455f) then Mekarsari (455..630f) is introduced.
  const creep = 1 + 0.08 * smooth01(f, 0, dur);
  const spotK =
    f >= 255 && f < 455 ? smooth01(f, 255, 285) * (1 - smooth01(f, 425, 455)) : 0;
  const spotM =
    f >= 455 && f < 630 ? smooth01(f, 455, 485) * (1 - smooth01(f, 598, 630)) : 0;

  const showMekarsariRule = f >= 460;
  const hpBlinkOnK = f >= 272 && f < 398 && (f < 332 ? Math.floor(f / 6) % 2 === 0 : true);
  const hpCrossedOnK = f >= 325 && f < 410;

  const premisChipOp =
    f >= 55 && f < 245 ? smooth01(f, 55, 70) * (1 - smooth01(f, 228, 245)) : 0;
  const kCardOp =
    f >= 280 && f < 452 ? smooth01(f, 280, 296) * (1 - smooth01(f, 434, 452)) : 0;
  const mCardOp =
    f >= 468 && f < 640 ? smooth01(f, 468, 484) * (1 - smooth01(f, 622, 640)) : 0;

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
          focus="dual"
          baseScale={creep}
          dimRight={0.44 * spotK}
          dimLeft={0.44 * spotM}
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

          {premisChipOp > 0.01 ? (
            <PixelChip
              text="DESA SAMA • ORANG SAMA • NASIB ACAK SAMA"
              x={W / 2}
              y={594}
              centerX
              borderColor={PX.gold}
              color={PX.goldHi}
              fontSize={11}
              style={{opacity: premisChipOp, transform: `scale(${0.95 + 0.05 * premisChipOp})`}}
            />
          ) : null}

          {/* Kertajaya Rule: HP blinks, gets crossed out with X, vanishes */}
          {hpBlinkOnK ? (
            <div
              style={{
                position: 'absolute',
                left: 320,
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

          {kCardOp > 0.01 ? (
            <PixelCard
              x={320}
              y={548}
              w={560}
              center
              borderColor={PX.red}
              bg="rgba(22, 16, 14, 0.95)"
              pad="12px 18px"
              style={{
                zIndex: 45,
                textAlign: 'center',
                opacity: kCardOp,
                transform: `scale(${0.95 + 0.05 * kCardOp})`,
              }}
            >
              <div style={{fontSize: 13, color: PX.gold}}>ATURAN KERTAJAYA: HP DILARANG TOTAL</div>
              <div style={{fontSize: 9, color: '#E8C8C0', marginTop: 8}}>
                X TIDAK ADA HP • X TIDAK ADA SINYAL
              </div>
            </PixelCard>
          ) : null}

          {/* Mekarsari Rule: Signal tower stands & HP free */}
          {mCardOp > 0.01 ? (
            <PixelCard
              x={960}
              y={548}
              w={580}
              center
              borderColor={PX.blueLight}
              bg="rgba(14, 22, 32, 0.95)"
              pad="12px 18px"
              style={{
                zIndex: 45,
                textAlign: 'center',
                opacity: mCardOp,
                transform: `scale(${0.95 + 0.05 * mCardOp})`,
              }}
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
  const dur = beatDur('B02');
  const u = smooth01(f, 0, 16);
  const creep = 1 + 0.06 * smooth01(f, 0, dur);

  return (
    <ParallelMapStage focus="dual" baseScale={creep} dimAll={0.6}>
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: u,
          transform: `scale(${0.95 + 0.05 * u})`,
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
  const dur = beatDur('B03');
  const u = smooth01(f, 0, 16);
  const creep = 1 + 0.06 * smooth01(f, 0, dur);

  return (
    <ParallelMapStage focus="dual" baseScale={creep} dimAll={0.38}>
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
  const dur = beatDur('B04');
  const cardAt = 48;
  const u = smooth01(f, cardAt, cardAt + 16);
  const creep = 1 + 0.06 * smooth01(f, 0, dur);

  const castChips = [
    {name: 'DIKA', sprite: 'dika_walk_0.png'},
    {name: 'BU ENDANG', sprite: 'endang_walk_0.png'},
    {name: 'PAK HARJO', sprite: 'harjo_walk_0.png'},
    {name: 'TIA', sprite: 'tia_walk_0.png'},
    {name: 'BANG OMEN', sprite: 'omen_walk_0.png'},
  ];

  return (
    <ParallelMapStage focus="dual" baseScale={creep} dimAll={0.46}>
      {/* Row of 5 cast cards with proportional full-body pixel sprites */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 106,
          translate: '-50% 0',
          display: 'flex',
          gap: 18,
          zIndex: 45,
        }}
      >
        {castChips.map((c, idx) => {
          const itemU = smooth01(f, idx * 8, idx * 8 + 14);
          return (
            <PixelCard
              key={c.name}
              borderColor={PX.gold}
              bg="rgba(20, 18, 16, 0.95)"
              pad="14px 16px"
              style={{
                opacity: itemU,
                transform: `scale(${0.92 + 0.08 * itemU})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                width: 174,
              }}
            >
              <PixelSprite src={c.sprite} w={88} h={143} />
              <div style={{fontSize: 10, color: PX.goldHi, textAlign: 'center'}}>{c.name}</div>
              <div style={{fontSize: 13, color: PX.gold}}>[ ? ]</div>
            </PixelCard>
          );
        })}
      </div>

      {/* ONE-TIME Guess Prompt Card (appears ONLY here per Brief B4) */}
      {f >= cardAt ? (
        <PixelCard
          x={W / 2}
          y={476}
          w={880}
          center
          borderColor={PX.gold}
          bg="rgba(18, 16, 14, 0.97)"
          pad="22px 30px"
          style={{
            opacity: u,
            transform: `scale(${0.95 + 0.05 * u})`,
            zIndex: 46,
            textAlign: 'center',
          }}
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

  // Fixed 50/50 split (zero sideways sekat swipe!) + smooth background zoom creep + pop/fade in place
  const creep = 1 + 0.08 * smooth01(f, 0, dur);
  const dimR =
    f < 175 ? 0.28 * smooth01(f, 8, 30) * (1 - smooth01(f, 148, 175)) : 0;
  const dimL =
    f >= 175 && f < 340 ? 0.28 * smooth01(f, 175, 198) * (1 - smooth01(f, 312, 340)) : 0;

  const leftChipU = smooth01(f, 12, 26);
  const rightChipU = smooth01(f, 178, 192);
  const pauseAt = dur - 135;
  const pauseU = smooth01(f, pauseAt, pauseAt + 16);

  return (
    <SplitWorldStage
      leftBg="bg_sekolah.png"
      rightBg="bg_sekolah.png"
      splitRatio={0.5}
      leftScale={creep}
      rightScale={creep}
      dimLeft={dimL}
      dimRight={dimR}
      leftContent={
        <>
          <div style={{position: 'absolute', left: '44%', top: 222, translate: '-50% 0'}}>
            <PixelSprite
              src={blink ? 'portrait_dika_blink.png' : 'portrait_dika_study.png'}
              w={188}
              h={388}
            />
          </div>
          <PixelChip
            text="BELAJAR TANPA GANGGUAN"
            x={320}
            y={592}
            centerX
            borderColor={PX.gold}
            color={PX.goldHi}
            fontSize={10}
            style={{
              opacity: leftChipU,
              transform: `scale(${0.94 + 0.06 * leftChipU})`,
            }}
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
            x={402}
            y={248 + Math.sin(f / 10) * 6}
            w={54}
            h={42}
          />
          <PixelChip
            text="HP TAK PERNAH JAUH DARI TANGAN"
            x={320}
            y={592}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
            style={{
              opacity: rightChipU,
              transform: `scale(${0.94 + 0.06 * rightChipU})`,
            }}
          />
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_dika_neutral.png"
        name="DIKA"
        age={16}
        role="PELAJAR KELAS 2 SMA"
        appearAt={2}
      />

      {/* Unanswered contemplative pause on "Kedengarannya." */}
      {f >= pauseAt ? (
        <PixelCard
          x={W / 2}
          y={516}
          w={680}
          center
          borderColor={PX.gold}
          bg="rgba(18, 16, 14, 0.95)"
          pad="14px 22px"
          style={{
            zIndex: 47,
            textAlign: 'center',
            opacity: pauseU,
            transform: `scale(${0.94 + 0.06 * pauseU})`,
          }}
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
  const dur = beatDur('B06'); // 364

  // Fixed 50/50 split (zero sideways sekat swipe!) + smooth background zoom creep + pop/fade in place
  const creep = 1 + 0.08 * smooth01(f, 0, dur);
  const dimR = f < 165 ? 0.28 * smooth01(f, 6, 26) * (1 - smooth01(f, 140, 165)) : 0;
  const dimL = f >= 165 ? 0.26 * smooth01(f, 165, 190) : 0;

  const leftChipU = smooth01(f, 10, 24);
  const rightPhaseU = smooth01(f, 168, 184);

  return (
    <SplitWorldStage
      leftBg="bg_pasar.png"
      rightBg="bg_pasar.png"
      splitRatio={0.5}
      leftScale={creep}
      rightScale={creep}
      dimLeft={dimL}
      dimRight={dimR}
      leftContent={
        <>
          <div style={{position: 'absolute', left: 112, top: 234}}>
            <PixelSprite src="portrait_endang_serve.png" w={172} h={355} />
          </div>
          {/* Proportional adult neighbor chatting word-of-mouth on dirt market path */}
          <Walker
            sprite="villager_green"
            path={[[474, 588]]}
            scale={5.2}
            idleFacingLeft
          />
          <PixelBubble
            text="Sayurnya segar, Bu!"
            x={338}
            y={192}
            maxW={250}
            tail="bottom-right"
            at={16}
          />
          <PixelChip
            text="LAKU DARI MULUT KE MULUT"
            x={320}
            y={602}
            centerX
            borderColor={PX.gold}
            fontSize={10}
            style={{
              zIndex: 44,
              opacity: leftChipU,
              transform: `scale(${0.94 + 0.06 * leftChipU})`,
            }}
          />
        </>
      }
      rightContent={
        <>
          <PixelSprite src="signal_tower.png" x={544} y={132} w={56} h={90} />
          <div style={{position: 'absolute', left: 118, top: 234}}>
            <PixelSprite src="portrait_endang_photo.png" w={172} h={355} />
          </div>
          <PixelSprite src="basket_goods.png" x={316} y={536} w={68} h={62} />
          {/* Order bubbles popping/bobbing in place via signal tower + outer-edge buyer (Pagar 12) */}
          <PixelSprite
            src="bubble_msg.png"
            x={476}
            y={198 + Math.sin(f / 9) * 6}
            w={48}
            h={38}
            style={{opacity: rightPhaseU}}
          />
          <PixelSprite
            src="bubble_msg.png"
            x={328}
            y={246 + Math.cos(f / 10) * 5}
            w={44}
            h={34}
            style={{opacity: smooth01(f, 182, 198)}}
          />
          <Walker
            sprite="villager_blue"
            path={[[518, 588]]}
            scale={5.2}
            opacity={rightPhaseU}
            idleFacingLeft
            carryingPhone
          />
          <PixelChip
            text="JUALAN LEWAT HP • PESANAN LUAR DESA"
            x={320}
            y={602}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
            style={{
              zIndex: 44,
              opacity: rightPhaseU,
              transform: `scale(${0.94 + 0.06 * rightPhaseU})`,
            }}
          />
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_endang_neutral.png"
        name="BU ENDANG"
        age={50}
        role="PEDAGANG PASAR"
        appearAt={2}
      />
    </SplitWorldStage>
  );
};

export const B07_Harjo: React.FC = () => {
  const f = useCurrentFrame();
  const dur = beatDur('B07');
  const talkOpen = Math.floor(f / 7) % 2 === 0;
  const creep = 1 + 0.07 * smooth01(f, 0, dur);
  const chipU = smooth01(f, 8, 22);

  return (
    <SplitWorldStage
      leftBg="bg_rumah_makan.png"
      rightBg="bg_rumah_makan.png"
      splitRatio={0.5}
      leftScale={creep}
      rightScale={creep}
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
          {/* Two proportional seated children (~240-247px scale, cropped cleanly at waist/lap) */}
          <div style={{position: 'absolute', left: 0, top: 344, width: 148, height: 168, overflow: 'hidden'}}>
            <PixelSprite src="villager_green_walk_0.png" w={148} h={240} />
          </div>
          <div style={{position: 'absolute', left: 476, top: 416, width: 152, height: 178, overflow: 'hidden'}}>
            <PixelSprite src="villager_blue_walk_0.png" w={152} h={247} flipX />
          </div>
          <PixelChip
            text="MALAM MILIK ANAK-ANAKNYA"
            x={320}
            y={602}
            centerX
            borderColor={PX.gold}
            fontSize={10}
            style={{zIndex: 44, opacity: chipU}}
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
          <div style={{position: 'absolute', left: 0, top: 344}}>
            <div style={{width: 148, height: 168, overflow: 'hidden'}}>
              <PixelSprite src="villager_green_walk_0.png" w={148} h={240} />
            </div>
            <PixelSprite src="hp_hand.png" x={96} y={102} w={42} h={52} />
          </div>
          <div style={{position: 'absolute', left: 476, top: 416}}>
            <div style={{width: 152, height: 178, overflow: 'hidden'}}>
              <PixelSprite src="villager_blue_walk_0.png" w={152} h={247} flipX />
            </div>
            <PixelSprite src="hp_hand.png" x={12} y={108} w={42} h={52} />
          </div>
          <PixelSprite src="hp_table.png" x={392} y={526} w={44} h={31} />
          <PixelChip
            text="MALAM MILIK LAYAR"
            x={320}
            y={602}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
            style={{zIndex: 44, opacity: chipU}}
          />
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_harjo_neutral.png"
        name="PAK HARJO"
        age={42}
        role="AYAH DUA ANAK"
        appearAt={2}
      />
    </SplitWorldStage>
  );
};

export const B08_Tia: React.FC = () => {
  const f = useCurrentFrame();
  const dur = beatDur('B08');
  const talkOpen = Math.floor(f / 8) % 2 === 0;
  const creep = 1 + 0.07 * smooth01(f, 0, dur);
  const chipU = smooth01(f, 8, 22);

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
      leftScale={creep}
      rightScale={creep}
      leftContent={
        <>
          {/* Grounded on the green foreground meadow (y=636), never floating on treetops */}
          <div style={{position: 'absolute', left: 164, top: 290}}>
            <PixelSprite
              src={talkOpen ? 'portrait_tia_open.png' : 'portrait_tia_happy.png'}
              w={168}
              h={346}
            />
          </div>
          {/* Proportional next-door neighbor standing on foreground meadow grass */}
          <Walker sprite="villager_red" path={[[466, 654]]} scale={5.1} idleFacingLeft chatDot />
          <PixelBubble
            text="Pagi, Tia!"
            x={374}
            y={284}
            maxW={190}
            tail="bottom-right"
            at={18}
          />
          <PixelChip
            text="TETANGGA SEBELAH • BERTEMU TIAP HARI"
            x={320}
            y={170}
            centerX
            borderColor={PX.gold}
            fontSize={10}
            style={{opacity: chipU}}
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
            const bob = Math.sin(f / 9 + i * 1.1) * 8;
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
            y={170}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
            style={{opacity: chipU}}
          />
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_tia_neutral.png"
        name="TIA"
        age={19}
        role="WARGA MUDA"
        appearAt={2}
      />
    </SplitWorldStage>
  );
};

export const B09_Omen: React.FC = () => {
  const f = useCurrentFrame();
  const dur = beatDur('B09');
  const creep = 1 + 0.07 * smooth01(f, 0, dur);
  const chipU = smooth01(f, 8, 22);
  const dualRuleU = smooth01(f, 290, 306);

  return (
    <SplitWorldStage
      leftBg="bg_bengkel.png"
      rightBg="bg_toko_hp.png"
      splitRatio={0.5}
      leftScale={creep}
      rightScale={creep}
      leftContent={
        <>
          <div style={{position: 'absolute', left: 232, top: 236}}>
            <PixelSprite src="portrait_omen_sad.png" w={172} h={355} />
          </div>
          <PixelChip
            text="BENGKEL SEPI • TIDAK ADA HP SAMA SEKALI"
            x={320}
            y={602}
            centerX
            borderColor={PX.amber}
            color={PX.amber}
            fontSize={9}
            style={{zIndex: 44, opacity: chipU}}
          />
        </>
      }
      rightContent={
        <>
          <div style={{position: 'absolute', left: 438, top: 232}}>
            <PixelSprite src="portrait_omen_repair_hp.png" w={172} h={355} flipX />
          </div>
          {/* Phones resting directly on the wooden repair desk surface */}
          <PixelSprite src="hp_pile.png" x={558} y={380} w={74} h={56} />
          {/* Proportional customers standing strictly on open checkered floor (right of glass case) */}
          <Walker sprite="villager_blue" path={[[362, 584]]} scale={5.1} carryingPhone />
          <Walker sprite="villager_green" path={[[268, 594]]} scale={4.9} carryingPhone />
          <PixelChip
            text="TOKO HP TIDAK PERNAH SEPI"
            x={320}
            y={602}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={10}
            style={{zIndex: 44, opacity: chipU}}
          />
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_omen_neutral.png"
        name="BANG OMEN"
        age={38}
        role="TUKANG SERVIS HP"
        appearAt={2}
      />

      {/* Two-sided rule reflection card */}
      {f >= 290 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 472,
            translate: '-50% 0',
            opacity: dualRuleU,
            transform: `scale(${0.94 + 0.06 * dualRuleU})`,
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
  const dur = beatDur('B10');
  // Seal at f=70, dock straight up to HUD center at f=118..188 (zero sideways drift), start Year 1 at f=204
  const dockU = smooth01(f, 118, 188);
  const startYear1 = f >= 204;
  const year1U = smooth01(f, 204, 220);
  const creep = 1 + 0.06 * smooth01(f, 0, dur);

  const cardX = W / 2;
  const cardY = 340 + (26 - 340) * dockU;
  const cardScale = 1 - 0.82 * dockU;
  const cardOp = smooth01(f, 0, 14) * (1 - smooth01(f, 170, 188));
  const sealU = smooth01(f, 58, 70);
  const dimMap = 0.45 - 0.31 * smooth01(f, 192, 214);

  return (
    <ParallelMapStage focus="dual" baseScale={creep} dimAll={dimMap}>
      {dockU < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: cardX,
            top: cardY,
            translate: '-50% -50%',
            opacity: cardOp,
            transform: `scale(${cardScale})`,
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
              <div style={{marginTop: 18, textAlign: 'center', opacity: sealU}}>
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
          style={{
            zIndex: 46,
            textAlign: 'center',
            opacity: year1U,
            transform: `scale(${0.94 + 0.06 * year1U})`,
          }}
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
