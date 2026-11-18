import React from 'react';
import {useCurrentFrame} from 'remotion';
import {W} from '../../lib/tokens';
import {PIXEL_FONT} from '../../pixelFont';
import {PX, PixelBubble, PixelCard, PixelChip, PixelSprite} from '../../components/PixelUI';
import {Walker, type WalkerSpec} from '../../components/Walker';
import {beatDur, pxSnap, step01} from '../plan';
import {DimensionLabelsBar} from '../hud';
import {ParallelMapStage} from '../map';
import {SplitWorldStage} from '../stage';
import {CharacterHeaderCard, CheckpointBeat, StudyQuoteBeat} from '../cards';

export const B11_Tahun12: React.FC = () => {
  const f = useCurrentFrame();
  // Sub-beat 1 (0..335): Kertajaya empty pocket -> early sleep -> kids play outside
  // Sub-beat 2 (335..695): Mekarsari fast bubbles -> subtle shadow at "Belum." (590..695)
  // Sub-beat 3 (695..958): Kertajaya neighbors ask the time ("Jam berapa, Pak?")
  let focus: 'dual' | 'left' | 'right' = 'dual';
  let strength = 0;
  if (f < 335) {
    focus = 'left';
    strength = f < 300 ? step01(f, 12, 48, 6) : 1 - step01(f, 300, 335, 6);
  } else if (f < 695) {
    focus = 'right';
    strength = f < 660 ? step01(f, 335, 370, 6) : 1 - step01(f, 660, 695, 6);
  } else {
    focus = 'left';
    strength = step01(f, 695, 730, 6) * 0.75;
  }

  const earlySleep = f >= 135 && f < 235;
  const belumShadow = f >= 585 && f < 695;

  // Extra walkers for "bertanya jam" in Kertajaya plaza
  const askTimeWalkers: WalkerSpec[] =
    f >= 695
      ? [
          {
            id: 'ask_a',
            sprite: 'villager_blue',
            path: [
              [260, 362],
              [326, 362],
            ],
            speed: 44,
            startFrame: 695,
            loopMode: 'once',
          },
          {
            id: 'ask_b',
            sprite: 'villager_green',
            path: [
              [412, 362],
              [356, 362],
            ],
            speed: 44,
            startFrame: 695,
            loopMode: 'once',
            idleFacingLeft: true,
          },
        ]
      : [];

  return (
    <ParallelMapStage
      focus={focus}
      focusStrength={strength}
      kertajayaPocketSearch={f < 135}
      fastBubbles={f >= 335 && f < 695}
      earlyNightKertajaya={earlySleep}
      dimRight={belumShadow ? 0.34 : 0}
      extraWalkers={askTimeWalkers}
    >
      {f < 130 ? (
        <PixelChip
          text="HARI PERTAMA KERTAJAYA: TANGAN MERABA SAKU KOSONG"
          x={380}
          y={584}
          centerX
          borderColor={PX.gold}
          fontSize={10}
          style={{zIndex: 45}}
        />
      ) : f < 335 ? (
        <PixelChip
          text="MINGGU KE-3: TIDUR LEBIH CEPAT • ANAK MAIN DI LUAR"
          x={380}
          y={584}
          centerX
          borderColor={PX.green}
          color={PX.greenHi}
          fontSize={10}
          style={{zIndex: 45}}
        />
      ) : f < 585 ? (
        <PixelChip
          text="MEKARSARI: PESAN SEDETIK • DAGANGAN LAKU SEMENIT"
          x={880}
          y={584}
          centerX
          borderColor={PX.blueLight}
          color="#E0F0FF"
          fontSize={10}
          style={{zIndex: 45}}
        />
      ) : f < 695 ? (
        <PixelCard
          x={880}
          y={576}
          w={460}
          center
          borderColor="#687C94"
          bg="rgba(12, 16, 24, 0.95)"
          pad="12px 18px"
          style={{zIndex: 45, textAlign: 'center'}}
        >
          <div style={{fontSize: 13, color: '#D4E4F7'}}>
            &ldquo;Tidak ada yang merasa kehilangan apa-apa. Belum.&rdquo;
          </div>
        </PixelCard>
      ) : (
        <>
          <PixelBubble
            text="Pak, jam berapa sekarang?"
            x={198}
            y={216}
            maxW={250}
            tail="bottom-center"
            at={736}
          />
          <PixelBubble
            text="Jam empat sore!"
            x={364}
            y={236}
            maxW={200}
            tail="bottom-left"
            at={808}
          />
          <PixelChip
            text="KERTAJAYA: ORANG MULAI SALING BERTANYA JAM"
            x={380}
            y={584}
            centerX
            borderColor={PX.gold}
            fontSize={10}
            style={{zIndex: 45}}
          />
        </>
      )}
    </ParallelMapStage>
  );
};

export const B12_CheckpointY2: React.FC = () => (
  <CheckpointBeat
    year={2}
    prevK={null}
    prevM={null}
    k={44}
    m={47}
    dur={beatDur('B12')}
    sparkleM
    subtitle="MEKARSARI UNGGUL DULUAN • HP CEPAT MEMBERI HASIL"
  />
);

export const B13_DikaY3: React.FC = () => {
  const f = useCurrentFrame();
  // In Mekarsari, message bubble repeatedly interrupts Dika every time he tries to study
  const interrupted = f >= 18 && f % 68 >= 10;

  return (
    <SplitWorldStage
      leftBg="bg_sekolah.png"
      rightBg="bg_sekolah.png"
      splitRatio={0.5}
      leftContent={
        <>
          <div style={{position: 'absolute', left: 226, top: 228}}>
            <PixelSprite src="portrait_dika_study.png" w={184} h={380} />
          </div>
          <PixelChip
            text="NILAI NAIK PELAN TAPI PASTI"
            x={320}
            y={590}
            centerX
            borderColor={PX.green}
            color={PX.greenHi}
            fontSize={10}
          />
        </>
      }
      rightContent={
        <>
          <div style={{position: 'absolute', left: 226, top: 228}}>
            <PixelSprite
              src={interrupted ? 'portrait_dika_phone.png' : 'portrait_dika_study.png'}
              w={184}
              h={380}
            />
          </div>
          {interrupted ? (
            <>
              <PixelSprite
                src="bubble_msg.png"
                x={408}
                y={246 + pxSnap(Math.sin(f / 6) * 5, 2)}
                w={60}
                h={46}
              />
              <PixelSprite
                src="bubble_msg.png"
                x={152}
                y={278 + pxSnap(Math.cos(f / 7) * 4, 2)}
                w={48}
                h={37}
              />
            </>
          ) : null}
          <PixelChip
            text="SETIAP BELAJAR, ADA YANG LEBIH MENARIK DARI BUKU"
            x={320}
            y={590}
            centerX
            borderColor={PX.red}
            color="#FFD6CC"
            fontSize={9}
          />
        </>
      }
    >
      {/* Learning dimension label glowing on Kertajaya side */}
      <DimensionLabelsBar y={66} glowK={['belajar']} compact />
    </SplitWorldStage>
  );
};

export const B14_KartuBeland: React.FC = () => (
  <StudyQuoteBeat
    citation="Beland & Murphy (2016)"
    journal="LABOUR ECONOMICS"
    points={[
      {text: '91 sekolah di Inggris dibandingkan sebelum & sesudah HP dilarang', atF: 18},
      {text: 'Nilai ujian naik — paling besar pada murid yang nilainya paling rendah', atF: 135},
      {text: 'Setara tambah satu jam sekolah seminggu', atF: 270},
      {text: 'Murid paling pintar tidak terpengaruh', atF: 385},
    ]}
    closingText="Yang paling tertinggal yang paling terbantu."
    closingAtF={480}
    accent={PX.gold}
  />
);

export const B15_EndangY3: React.FC = () => {
  const f = useCurrentFrame();
  // Emphasize Mekarsari clearly (splitRatio=0.36 -> leftW=460, rightW=820) per Pagar 5
  const splitRatio = 0.36;
  const leftW = pxSnap(W * splitRatio, 4);
  const rightW = W - leftW;
  const takingPhoto = f < 260 || f % 90 < 60;

  return (
    <SplitWorldStage
      leftBg="bg_pasar.png"
      rightBg="bg_pasar.png"
      splitRatio={splitRatio}
      dimLeft={0.22}
      leftContent={
        <>
          <div style={{position: 'absolute', left: 108, top: 244}}>
            <PixelSprite src="portrait_endang_serve.png" w={164} h={338} />
          </div>
          <Walker sprite="villager_green" path={[[336, 578]]} scale={1.5} idleFacingLeft />
          <PixelChip
            text="PENGHASILAN SAMA SAJA • TETANGGA SENDIRI"
            x={Math.round(leftW / 2)}
            y={594}
            centerX
            borderColor="#8A7E6E"
            color="#D8CFC2"
            fontSize={8}
          />
        </>
      }
      rightContent={
        <>
          <PixelSprite src="signal_tower.png" x={rightW - 92} y={120} w={58} h={94} />
          {/* Grounded overflowing baskets resting on the open dirt market path */}
          <PixelSprite src="basket_goods.png" x={338} y={536} w={68} h={62} />
          <PixelSprite src="basket_goods.png" x={422} y={546} w={68} h={62} />
          <PixelSprite src="basket_goods.png" x={506} y={536} w={68} h={62} />

          <div style={{position: 'absolute', left: 146, top: 232}}>
            <PixelSprite
              src={takingPhoto ? 'portrait_endang_photo.png' : 'portrait_endang_happy.png'}
              w={176}
              h={364}
            />
          </div>

          {/* Orders via signal tower + buyers entering ONLY from far right outer edge (Pagar 12) */}
          {[0, 1].map((i) => {
            const u = ((f * 2.2 + i * 42) % 96) / 96;
            return (
              <PixelSprite
                key={i}
                src="bubble_msg.png"
                x={pxSnap(rightW - 104 - u * 360, 2)}
                y={pxSnap(168 + u * 140, 2)}
                w={44}
                h={34}
              />
            );
          })}

          <Walker
            sprite="villager_blue"
            path={[
              [rightW - 22, 578],
              [610, 578],
            ]}
            speed={52}
            loopMode="pingpong"
            phase={0.1}
            scale={1.5}
            idleFacingLeft
            carryingPhone
          />
          <Walker
            sprite="villager_red"
            path={[
              [rightW - 18, 590],
              [682, 590],
            ]}
            speed={46}
            loopMode="pingpong"
            phase={0.55}
            scale={1.5}
            idleFacingLeft
            carryingPhone
          />

          <PixelChip
            text="FOTO KE GRUP • PEMBELI DATANG DARI LUAR DESA"
            x={Math.round(rightW / 2)}
            y={594}
            centerX
            borderColor={PX.blueLight}
            color="#E8F6FF"
            fontSize={10}
          />
        </>
      }
    >
      <DimensionLabelsBar y={66} glowM={['usaha']} compact />
    </SplitWorldStage>
  );
};

export const B16_KartuJensen: React.FC = () => (
  <StudyQuoteBeat
    citation="Jensen (2007)"
    journal="QUARTERLY JOURNAL OF ECONOMICS"
    points={[
      {text: 'Nelayan di Kerala, India menelepon pasar sebelum mendarat', atF: 18},
      {text: 'Ikan terbuang hilang', atF: 155},
      {text: 'Untung naik 8 persen • Harga turun 4 persen', atF: 275},
    ]}
    closingText="Untuk pedagang, HP bukan gangguan. HP adalah pasar."
    closingAtF={430}
    accent={PX.blueLight}
  />
);

export const B17_CheckpointY4: React.FC = () => (
  <CheckpointBeat
    year={4}
    prevK={44}
    prevM={47}
    k={52}
    m={54}
    dur={beatDur('B17')}
    dimmerLeadBadge
    marketTier={1}
    subtitle="MEKARSARI MASIH UNGGUL • TAPI JARAKNYA MENYUSUT"
  />
);

export const B18_UltahTia: React.FC = () => {
  const f = useCurrentFrame();

  // 12 young/adult villagers walking one by one to Tia on the green foreground meadow (all 12 arrive!)
  const kFriends: Array<{
    sprite: 'villager_red' | 'villager_blue' | 'villager_green';
    x0: number;
    x1: number;
    y: number;
    startF: number;
  }> = [
    {sprite: 'villager_red', x0: 28, x1: 146, y: 618, startF: 20},
    {sprite: 'villager_blue', x0: 24, x1: 186, y: 634, startF: 36},
    {sprite: 'villager_green', x0: 30, x1: 112, y: 642, startF: 52},
    {sprite: 'villager_green', x0: 612, x1: 454, y: 618, startF: 68},
    {sprite: 'villager_red', x0: 616, x1: 496, y: 632, startF: 84},
    {sprite: 'villager_blue', x0: 610, x1: 428, y: 644, startF: 100},
    {sprite: 'villager_red', x0: 26, x1: 218, y: 626, startF: 116},
    {sprite: 'villager_green', x0: 32, x1: 76, y: 624, startF: 132},
    {sprite: 'villager_red', x0: 614, x1: 534, y: 622, startF: 148},
    {sprite: 'villager_blue', x0: 608, x1: 568, y: 638, startF: 164},
    {sprite: 'villager_blue', x0: 36, x1: 162, y: 648, startF: 180},
    {sprite: 'villager_green', x0: 606, x1: 472, y: 648, startF: 196},
  ];

  // Storm of message bubbles around solitary Tia in Mekarsari (ZERO visitors!)
  const mBubbles: Array<[number, number]> = [
    [-190, -70],
    [-125, -105],
    [0, -118],
    [125, -105],
    [190, -70],
    [-205, 5],
    [200, 0],
    [-180, 80],
    [180, 82],
    [-105, 108],
    [105, 110],
    [-145, -28],
    [145, -32],
  ];

  return (
    <SplitWorldStage
      leftBg="bg_desa_siang.png"
      rightBg="bg_desa_siang.png"
      splitRatio={0.5}
      leftContent={
        <>
          <div style={{position: 'absolute', left: 238, top: 292}}>
            <PixelSprite src="portrait_tia_happy.png" w={164} h={338} />
          </div>
          {kFriends.map((fr, idx) => (
            <Walker
              key={idx}
              sprite={fr.sprite}
              path={[
                [fr.x0, fr.y],
                [fr.x1, fr.y],
              ]}
              speed={68}
              startFrame={fr.startF}
              loopMode="once"
              scale={1.18}
              idleFacingLeft={fr.x0 > 320}
              chatDot={f >= fr.startF + 80}
            />
          ))}
          <PixelCard
            x={320}
            y={184}
            w={540}
            center
            borderColor={PX.gold}
            bg="rgba(20, 18, 14, 0.95)"
            pad="10px 16px"
            style={{textAlign: 'center'}}
          >
            <div style={{fontSize: 12, color: PX.gold}}>12 UCAPAN • SEMUANYA DATANG</div>
            <div style={{fontSize: 9, color: PX.goldHi, marginTop: 6}}>
              12 TEMAN &bull; TIDAK PERNAH MERASA SENDIRIAN
            </div>
          </PixelCard>
        </>
      }
      rightContent={
        <>
          {/* ZERO visitors walk to Tia in Mekarsari; Tia stays alone with her HP */}
          <div style={{position: 'absolute', left: 238, top: 292}}>
            <PixelSprite
              src={f >= 320 ? 'portrait_tia_sad.png' : 'portrait_tia_phone.png'}
              w={164}
              h={338}
            />
            {f >= 320 ? <PixelSprite src="hp_hand.png" x={118} y={176} w={34} h={42} /> : null}
          </div>
          {mBubbles.map(([dx, dy], idx) => (
            <PixelSprite
              key={idx}
              src="bubble_msg.png"
              x={298 + dx}
              y={398 + dy + pxSnap(Math.sin(f / 7 + idx) * 6, 2)}
              w={40}
              h={31}
            />
          ))}
          <PixelCard
            x={320}
            y={184}
            w={560}
            center
            borderColor={PX.blueLight}
            bg="rgba(14, 20, 30, 0.95)"
            pad="10px 16px"
            style={{textAlign: 'center'}}
          >
            <div style={{fontSize: 12, color: PX.blueLight}}>
              200 UCAPAN • TIDAK SATU PUN DATANG
            </div>
            <div style={{fontSize: 9, color: '#D4E6FA', marginTop: 6}}>
              800 TEMAN &bull; MERASA SENDIRIAN
            </div>
          </PixelCard>
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_tia_happy.png"
        name="TIA"
        age={24}
        role="ULANG TAHUN KE-24"
      />
    </SplitWorldStage>
  );
};

export const B19_HarjoMakanMontase: React.FC = () => {
  const f = useCurrentFrame();
  const laughOpen = Math.floor(f / 6) % 2 === 0;
  const highlightDishes = f >= 210;

  return (
    <SplitWorldStage
      leftBg="bg_rumah_makan.png"
      rightBg="bg_rumah_makan.png"
      splitRatio={0.5}
      leftTint="rgba(255, 195, 100, 0.08)"
      rightTint="rgba(22, 52, 105, 0.28)"
      leftContent={
        <>
          <div
            style={{
              position: 'absolute',
              left: 164,
              top: 196,
              width: 172,
              height: 238,
              overflow: 'hidden',
            }}
          >
            <PixelSprite
              src={laughOpen ? 'portrait_harjo_open.png' : 'portrait_harjo_happy.png'}
              w={172}
              h={355}
            />
          </div>
          <div style={{position: 'absolute', left: 26, top: 382, width: 64, height: 84, overflow: 'hidden'}}>
            <PixelSprite src="villager_green_walk_0.png" w={56} h={91} />
          </div>
          <div style={{position: 'absolute', left: 422, top: 366, width: 64, height: 80, overflow: 'hidden'}}>
            <PixelSprite src="villager_blue_walk_0.png" w={56} h={91} flipX />
          </div>

          <PixelBubble text="Hahaha! Seru banget, Yah!" x={24} y={248} maxW={220} at={24} />
          <PixelBubble
            text="Terus gimana ceritanya?"
            x={364}
            y={254}
            maxW={220}
            tail="bottom-right"
            at={110}
          />

          {/* Pixel spotlight frame on identical dishes */}
          {highlightDishes ? (
            <div
              style={{
                position: 'absolute',
                left: 138,
                top: 424,
                width: 288,
                height: 124,
                border: `3px dashed ${PX.gold}`,
                boxShadow: '0 0 0 2px #000',
                pointerEvents: 'none',
              }}
            />
          ) : null}

          <PixelChip
            text="BERCERITA SAMPAI TERTAWA"
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
          <div
            style={{
              position: 'absolute',
              left: 164,
              top: 206,
              width: 172,
              height: 222,
              overflow: 'hidden',
            }}
          >
            <PixelSprite src="portrait_harjo_dinner_phone.png" w={172} h={355} />
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

          {highlightDishes ? (
            <div
              style={{
                position: 'absolute',
                left: 138,
                top: 424,
                width: 288,
                height: 124,
                border: `3px dashed ${PX.gold}`,
                boxShadow: '0 0 0 2px #000',
                pointerEvents: 'none',
              }}
            />
          ) : null}

          <PixelChip
            text="MAKAN DALAM DIAM • MASING-MASING LAYAR"
            x={320}
            y={590}
            centerX
            borderColor={PX.blueLight}
            color="#D8EEFF"
            fontSize={9}
          />
        </>
      }
    >
      {highlightDishes ? (
        <PixelCard
          x={W / 2}
          y={114}
          w={680}
          center
          borderColor={PX.gold}
          bg="rgba(18, 16, 14, 0.96)"
          pad="12px 22px"
          style={{zIndex: 48, textAlign: 'center'}}
        >
          <div style={{fontSize: 13, color: PX.gold}}>MAKANANNYA SAMA PERSIS</div>
          <div style={{fontSize: 10, color: PX.white, marginTop: 8}}>
            YANG HILANG ADALAH PERCAKAPANNYA.
          </div>
        </PixelCard>
      ) : null}
    </SplitWorldStage>
  );
};

export const B20_OmenY5: React.FC = () => {
  return (
    <SplitWorldStage
      leftBg="bg_bengkel.png"
      rightBg="bg_toko_hp.png"
      splitRatio={0.5}
      leftContent={
        <>
          {/* Radio & bicycle repaired (background bicycle on right; water pump narration-only per Pagar 10a!) */}
          <div style={{position: 'absolute', left: 192, top: 228}}>
            <PixelSprite src="portrait_omen_repair_radio.png" w={172} h={355} />
          </div>
          <PixelSprite src="radio.png" x={66} y={362} w={78} h={66} />
          {/* Villagers walking cleanly on open wooden plank floor */}
          <Walker
            sprite="villager_green"
            path={[
              [368, 584],
              [446, 584],
            ]}
            speed={38}
            scale={1.45}
            idleFacingLeft
            chatDot
          />
          <Walker
            sprite="villager_red"
            path={[
              [568, 588],
              [492, 588],
            ]}
            speed={36}
            scale={1.45}
            idleFacingLeft
          />
          <PixelChip
            text="RADIO & SEPEDA • MENJADI TUKANG SEGALA"
            x={320}
            y={594}
            centerX
            borderColor={PX.gold}
            fontSize={10}
          />
        </>
      }
      rightContent={
        <>
          <div style={{position: 'absolute', left: 196, top: 228}}>
            <PixelSprite src="portrait_omen_repair_hp.png" w={172} h={355} />
          </div>
          {/* Growing phone stack resting on wooden workbench + second stack on display counter */}
          <PixelSprite src="hp_pile.png" x={472} y={378} w={90} h={68} />
          <PixelSprite src="hp_table.png" x={568} y={396} w={48} h={34} />

          {/* One hired generic villager assistant standing on open checkered tile floor */}
          <div style={{position: 'absolute', left: 374, top: 484}}>
            <PixelSprite src="villager_blue_walk_0.png" w={56} h={91} flipX />
            <div
              style={{
                marginTop: 2,
                background: '#162434',
                border: `2px solid ${PX.blueLight}`,
                padding: '3px 6px',
                fontFamily: PIXEL_FONT,
                fontSize: 8,
                color: PX.blueLight,
                textAlign: 'center',
              }}
            >
              ASISTEN
            </div>
          </div>

          <PixelChip
            text="TOKO MAKIN BESAR • MEMPEKERJAKAN SATU ASISTEN"
            x={320}
            y={594}
            centerX
            borderColor={PX.blueLight}
            color="#E0F0FF"
            fontSize={9}
          />
        </>
      }
    />
  );
};

export const B21_CheckpointY6: React.FC = () => (
  <CheckpointBeat
    year={6}
    prevK={52}
    prevM={54}
    k={59}
    m={58}
    dur={beatDur('B21')}
    crossoverY6
    marketTier={1}
    subtitle="KERTAJAYA MENYALIP — PELAN, TANPA SUARA"
  />
);
