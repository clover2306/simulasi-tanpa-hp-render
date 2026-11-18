import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {W} from '../../lib/tokens';
import {PIXEL_FONT} from '../../pixelFont';
import {PX, PixelBubble, PixelCard, PixelChip, PixelSprite} from '../../components/PixelUI';
import {Walker} from '../../components/Walker';
import {beatDur, pxSnap, step01} from '../plan';
import {SplitWorldStage} from '../stage';
import {CharacterHeaderCard, CheckpointBeat, StudyQuoteBeat} from '../cards';

export const B34_TiaBerhenti: React.FC = () => {
  const f = useCurrentFrame();
  const splitRatio = 0.26;
  const leftW = pxSnap(W * splitRatio, 4);
  const rightW = W - leftW;

  // 4 beats across 691f:
  // 1 (0..172): Week 1 restless pacing
  // 2 (172..344): Week 2 sleeps better (lights out early)
  // 3 (344..518): Week 3 calls her mother (ONLY Tia + call speech bubble; mother NOT drawn! Pagar 10)
  // 4 (518..691): Returns using phone much less forever (HP stays mostly in pocket)
  const beatIdx = f < 172 ? 1 : f < 344 ? 2 : f < 518 ? 3 : 4;

  return (
    <SplitWorldStage
      leftBg={beatIdx === 2 ? 'bg_malam.png' : 'bg_desa_siang.png'}
      rightBg={beatIdx === 2 ? 'bg_malam.png' : 'bg_desa_siang.png'}
      splitRatio={splitRatio}
      rightTint={beatIdx === 2 ? 'rgba(6, 10, 24, 0.34)' : undefined}
      leftContent={
        /* Kertajaya calm & dimmed at left without dramatization, identical day/night */
        beatIdx === 2 ? null : (
          <div style={{position: 'absolute', left: 84, top: 314}}>
            <PixelSprite src="portrait_tia_happy.png" w={156} h={322} />
          </div>
        )
      }
      rightContent={
        <>
          {beatIdx === 1 ? (
            <>
              <Walker
                sprite="tia"
                path={[
                  [220, 638],
                  [720, 638],
                ]}
                speed={120}
                scale={2.05}
                questionMark
              />
              <PixelChip
                text="MINGGU KE-1: GELISAH TANPA AKUN"
                x={Math.round(rightW / 2)}
                y={162}
                centerX
                borderColor={PX.amber}
                color={PX.amber}
                fontSize={10}
              />
            </>
          ) : beatIdx === 2 ? (
            <>
              {/* Early darkened house windows on native night village + Zzz sleep indicator */}
              <div
                style={{
                  position: 'absolute',
                  left: 560,
                  top: 342 + pxSnap(Math.sin(f / 10) * 6, 2),
                  background: '#162030',
                  border: `2px solid ${PX.blueLight}`,
                  padding: '8px 14px',
                  fontFamily: PIXEL_FONT,
                  fontSize: 14,
                  color: PX.blueLight,
                }}
              >
                Z z z ...
              </div>
              <PixelChip
                text="MINGGU KE-2: LAMPU PADAM AWAL • TIDUR LEBIH NYENYAK"
                x={Math.round(rightW / 2)}
                y={590}
                centerX
                borderColor={PX.green}
                color={PX.greenHi}
                fontSize={10}
              />
            </>
          ) : beatIdx === 3 ? (
            <>
              {/* ONLY Tia grounded on foreground grass + voice speech bubble; Mother is NOT drawn (Pagar 10b) */}
              <div style={{position: 'absolute', left: 376, top: 258}}>
                <PixelSprite src="portrait_tia_call.png" w={184} h={380} />
              </div>
              <PixelBubble
                text='"Halo, Bu? Tia telepon sungguhan..."'
                x={124}
                y={248}
                maxW={290}
                tail="bottom-right"
                at={352}
              />
              <PixelBubble
                text='[Suara Ibu]: "Syukurlah, Nak..."'
                x={568}
                y={288}
                maxW={290}
                tail="none"
                accent={PX.goldShadow}
                at={405}
              />
              <PixelChip
                text="MINGGU KE-3: BENAR-BENAR MENELEPON IBUNYA"
                x={Math.round(rightW / 2)}
                y={162}
                centerX
                borderColor={PX.gold}
                color={PX.goldHi}
                fontSize={10}
              />
            </>
          ) : (
            <>
              <div style={{position: 'absolute', left: 376, top: 258}}>
                <PixelSprite src="portrait_tia_happy.png" w={184} h={380} />
              </div>
              {/* Phone kept quietly in pocket */}
              <div
                style={{
                  position: 'absolute',
                  left: 576,
                  top: 486,
                  background: 'rgba(18, 22, 28, 0.92)',
                  border: '2px solid #5A6E84',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <PixelSprite src="hp_table.png" w={32} h={22} style={{opacity: 0.55}} />
                <span style={{fontFamily: PIXEL_FONT, fontSize: 9, color: '#C6D8EA'}}>
                  DI SAKU
                </span>
              </div>
              <PixelChip
                text="SETELAH SEBULAN: MEMAKAI HP LEBIH SEDIKIT — SELAMANYA"
                x={Math.round(rightW / 2)}
                y={162}
                centerX
                borderColor={PX.blueLight}
                color="#E4F2FF"
                fontSize={9}
              />
            </>
          )}
        </>
      }
    >
      <CharacterHeaderCard
        portrait="portrait_tia_neutral.png"
        name="TIA"
        age={34}
        role="EKSPERIMEN BERHENTI SEBULAN"
      />
    </SplitWorldStage>
  );
};

export const B35_KartuAllcott: React.FC = () => (
  <StudyQuoteBeat
    citation="Allcott dkk. (2020)"
    journal="AMERICAN ECONOMIC REVIEW"
    points={[
      {text: 'Ribuan orang Amerika dibayar berhenti Facebook empat minggu', atF: 18},
      {text: 'Sejam sehari waktu kembali', atF: 145},
      {text: 'Lebih banyak waktu dengan keluarga & teman • Merasa lebih baik', atF: 265},
      {text: 'Tapi ada harganya: jadi kurang tahu berita', atF: 385},
    ]}
    closingText="Sama seperti simulasi ini — tidak ada yang gratis."
    closingAtF={485}
    accent={PX.gold}
  />
);

export const B36_EndangMenang: React.FC = () => {
  const f = useCurrentFrame();
  // Full commanding focus on Mekarsari (78% right), Kertajaya still visible at 22% left for fair contrast!
  const splitRatio = 0.22;
  const leftW = pxSnap(W * splitRatio, 4);
  const rightW = W - leftW;

  return (
    <SplitWorldStage
      leftBg="bg_pasar.png"
      rightBg="bg_pasar.png"
      splitRatio={splitRatio}
      dimLeft={0.35}
      leftContent={
        <>
          <div style={{position: 'absolute', left: 54, top: 248}}>
            <PixelSprite src="portrait_endang_serve.png" w={156} h={322} />
          </div>
          <PixelChip
            text="LAPAK BIASA"
            x={Math.round(leftW / 2)}
            y={590}
            centerX
            borderColor="#7A6E5D"
            fontSize={8}
          />
        </>
      }
      rightContent={
        <>
          {/* Expanded physical stall + abundant overflowing baskets grounded on the dirt market path */}
          <PixelSprite src="stall_endang.png" x={456} y={422} w={152} h={120} />
          <PixelSprite src="basket_goods.png" x={76} y={536} w={68} h={62} />
          <PixelSprite src="basket_goods.png" x={152} y={548} w={68} h={62} />
          <PixelSprite src="basket_goods.png" x={384} y={536} w={68} h={62} />
          <PixelSprite src="basket_goods.png" x={534} y={542} w={68} h={62} />

          {/* "Tokonya yang kedua": physical market stall + grounded HP kiosk side-by-side */}
          <div
            style={{
              position: 'absolute',
              left: 622,
              top: 428,
              background: 'rgba(16, 26, 38, 0.96)',
              border: `3px solid ${PX.blueLight}`,
              boxShadow: '4px 4px 0 rgba(0,0,0,0.7)',
              padding: '12px 18px',
              textAlign: 'center',
            }}
          >
            <PixelSprite src="hp_hand.png" w={52} h={66} />
            <div
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: 8,
                color: PX.blueLight,
                marginTop: 8,
              }}
            >
              TOKO KEDUA: HP
            </div>
          </div>

          <div style={{position: 'absolute', left: 198, top: 222}}>
            <PixelSprite src="portrait_endang_happy.png" w={188} h={388} />
          </div>

          {/* Buyers entering strictly from outer right edge */}
          <Walker
            sprite="villager_blue"
            path={[
              [rightW - 24, 578],
              [796, 578],
            ]}
            speed={46}
            scale={1.55}
            idleFacingLeft
            carryingPhone
          />
          <Walker
            sprite="villager_red"
            path={[
              [rightW - 18, 590],
              [876, 590],
            ]}
            speed={42}
            phase={0.45}
            scale={1.5}
            idleFacingLeft
            carryingPhone
          />

          {f >= 36 ? (
            <PixelCard
              x={Math.round(rightW / 2)}
              y={128}
              w={680}
              center
              borderColor={PX.gold}
              bg="rgba(18, 16, 14, 0.96)"
              pad="16px 24px"
              style={{textAlign: 'center'}}
            >
              <div style={{fontSize: 15, color: PX.gold}}>
                &ldquo;Di sinilah aku harus jujur.&rdquo;
              </div>
              <div style={{fontSize: 10, color: PX.white, marginTop: 10, lineHeight: 1.6}}>
                Untuk Bu Endang, HP bukan musuh. HP adalah tokonya yang kedua.
              </div>
            </PixelCard>
          ) : null}

          <PixelChip
            text="TOKO TERBESAR DI WILAYAH ITU • TIDAK SEMUA ORANG KALAH KARENA HP"
            x={Math.round(rightW / 2)}
            y={590}
            centerX
            borderColor={PX.blueLight}
            color="#E8F6FF"
            fontSize={9}
          />
        </>
      }
    />
  );
};

export const B37_CheckpointY17: React.FC = () => (
  /* marketTier=2 keeps Endang's prosperous market visibly thriving on Mekarsari's map! */
  <CheckpointBeat
    year={17}
    prevK={76}
    prevM={67}
    k={80}
    m={69}
    dur={beatDur('B37')}
    marketTier={2}
  />
);

export const B38_Dialog3DuaMalam: React.FC = () => {
  const f = useCurrentFrame();
  // Synchronized lights out at f=590 -> brief dark hold at end (690..753), ZERO dialog boxes!
  const lightsOn = f < 590;
  const endFade = step01(f, 685, 742, 8);

  // 7 message bubbles in Mekarsari shop window extinguish one by one before lights out (Brief A4)
  const sevenBubbles: Array<{x: number; y: number; offAt: number; scam: boolean}> = [
    {x: 344, y: 318, offAt: 160, scam: true},
    {x: 396, y: 312, offAt: 220, scam: false},
    {x: 448, y: 318, offAt: 280, scam: true},
    {x: 500, y: 312, offAt: 340, scam: true},
    {x: 358, y: 418, offAt: 400, scam: false},
    {x: 404, y: 422, offAt: 460, scam: true},
    {x: 450, y: 418, offAt: 520, scam: false},
  ];

  return (
    <AbsoluteFill>
      <SplitWorldStage
        leftBg="bg_malam.png"
        rightBg="bg_malam.png"
        splitRatio={0.5}
        leftTint={lightsOn ? 'rgba(255, 185, 85, 0.08)' : 'rgba(4, 6, 14, 0.56)'}
        rightTint={lightsOn ? 'rgba(65, 130, 210, 0.08)' : 'rgba(4, 6, 14, 0.56)'}
        leftContent={
          <>
            {/* Grounded workshop on night village path; warm interior window glow ONLY inside window */}
            {lightsOn ? (
              <div
                style={{
                  position: 'absolute',
                  left: 112,
                  top: 416,
                  width: 124,
                  height: 68,
                  background: 'rgba(255, 200, 95, 0.45)',
                }}
              />
            ) : null}
            <PixelSprite
              src="workshop_omen.png"
              x={76}
              y={356}
              w={216}
              h={188}
              style={{filter: lightsOn ? undefined : 'brightness(0.48)'}}
            />
            <PixelSprite
              src="radio.png"
              x={98}
              y={488}
              w={58}
              h={48}
              style={{filter: lightsOn ? undefined : 'brightness(0.48)'}}
            />
            <PixelSprite
              src="bicycle.png"
              x={174}
              y={480}
              w={92}
              h={64}
              style={{filter: lightsOn ? undefined : 'brightness(0.48)'}}
            />

            {/* Omen closing workshop */}
            <Walker sprite="omen" path={[[296, 554]]} scale={1.55} />

            {/* 3 young dark-haired apprentices walking home with dirty hands & full stomachs */}
            <Walker
              sprite="villager_blue"
              path={[
                [356, 562],
                [564, 562],
              ]}
              speed={28}
              loopMode="once"
              scale={1.45}
              dirtyHands
            />
            <Walker
              sprite="villager_green"
              path={[
                [314, 572],
                [512, 572],
              ]}
              speed={26}
              loopMode="once"
              scale={1.45}
              dirtyHands
            />
            <Walker
              sprite="villager_red"
              path={[
                [272, 582],
                [458, 582],
              ]}
              speed={25}
              loopMode="once"
              scale={1.45}
              dirtyHands
            />

            <PixelChip
              text="TIGA MURID PULANG • BISA MEMPERBAIKI APA SAJA"
              x={320}
              y={594}
              centerX
              borderColor={PX.gold}
              fontSize={9}
            />
          </>
        }
        rightContent={
          <>
            {lightsOn ? (
              <div
                style={{
                  position: 'absolute',
                  left: 368,
                  top: 416,
                  width: 148,
                  height: 76,
                  background: 'rgba(130, 205, 255, 0.42)',
                }}
              />
            ) : null}
            <PixelSprite
              src="shop_hp_omen.png"
              x={340}
              y={356}
              w={216}
              h={188}
              style={{filter: lightsOn ? undefined : 'brightness(0.48)'}}
            />
            <Walker sprite="omen" path={[[314, 554]]} scale={1.55} idleFacingLeft />

            {/* 7 message bubbles in shop window extinguishing one by one */}
            {sevenBubbles.map((b, idx) =>
              f < b.offAt && lightsOn ? (
                <PixelSprite
                  key={idx}
                  src={b.scam ? 'bubble_scam.png' : 'bubble_msg.png'}
                  x={b.x}
                  y={b.y}
                  w={36}
                  h={28}
                />
              ) : null,
            )}

            <PixelChip
              text="PEKERJAAN TERPENTINGNYA SEKARANG: MENJELASKAN"
              x={320}
              y={594}
              centerX
              borderColor={PX.blueLight}
              color="#E0F0FF"
              fontSize={9}
            />
          </>
        }
      >
        <PixelChip
          text="MALAM YANG SAMA • DUA DUNIA YANG BERBEDA"
          x={W / 2}
          y={72}
          centerX
          borderColor="#8A8070"
          color={PX.white}
          fontSize={11}
          style={{zIndex: 47}}
        />
      </SplitWorldStage>

      {endFade > 0 ? (
        <AbsoluteFill style={{backgroundColor: '#000', opacity: endFade, zIndex: 55}} />
      ) : null}
    </AbsoluteFill>
  );
};

export const B39_Y20Intro: React.FC = () => (
  <CheckpointBeat
    year={20}
    prevK={80}
    prevM={69}
    k={86}
    m={72}
    dur={beatDur('B39')}
    marketTier={2}
    isFinalY20
    introAtF={163}
  />
);

export const B40_VerdictDika: React.FC = () => (
  <SplitWorldStage
    leftBg="bg_sekolah.png"
    rightBg="bg_toko_hp.png"
    splitRatio={0.72}
    leftContent={
      <>
        <div style={{position: 'absolute', left: 368, top: 218}}>
          <PixelSprite src="portrait_dika_teacher.png" w={188} h={388} />
        </div>
        {/* Young dark-haired students seated cleanly behind classroom desks */}
        <div style={{position: 'absolute', left: 162, top: 432, width: 52, height: 48, overflow: 'hidden'}}>
          <PixelSprite src="villager_blue_walk_0.png" w={44} h={72} />
        </div>
        <div style={{position: 'absolute', left: 602, top: 436, width: 52, height: 48, overflow: 'hidden'}}>
          <PixelSprite src="villager_red_walk_0.png" w={44} h={72} flipX />
        </div>
        <div style={{position: 'absolute', left: 744, top: 416, width: 52, height: 48, overflow: 'hidden'}}>
          <PixelSprite src="villager_green_walk_0.png" w={44} h={72} flipX />
        </div>
        <PixelChip
          text="GURU • HIDUP TENANG • FOKUS 20 TAHUN JADI KARIER"
          x={460}
          y={590}
          centerX
          borderColor={PX.gold}
          fontSize={10}
        />
      </>
    }
    rightContent={
      <div style={{position: 'absolute', left: 96, top: 236}}>
        <PixelSprite src="portrait_dika_sad.png" w={164} h={338} flipX />
      </div>
    }
  >
    <CharacterHeaderCard
      portrait="portrait_dika_teacher.png"
      name="DIKA"
      role="HASIL TAHUN KE-20"
      verdictText="LEBIH BAIK DI KERTAJAYA"
      verdictAccent={PX.gold}
      mechanism="FOKUS BELAJAR"
    />
  </SplitWorldStage>
);

export const B41_VerdictEndang: React.FC = () => (
  /* Equal visual weight, dignity, and framing as every other verdict (Pagar 5!) */
  <SplitWorldStage
    leftBg="bg_pasar.png"
    rightBg="bg_pasar.png"
    splitRatio={0.28}
    leftContent={
      <div style={{position: 'absolute', left: 92, top: 236}}>
        <PixelSprite src="portrait_endang_serve.png" w={164} h={338} />
      </div>
    }
    rightContent={
      <>
        {/* Grounded abundant harvest baskets resting on the dirt market path */}
        <PixelSprite src="stall_endang.png" x={528} y={422} w={152} h={120} />
        <PixelSprite src="basket_goods.png" x={118} y={536} w={68} h={62} />
        <PixelSprite src="basket_goods.png" x={196} y={548} w={68} h={62} />
        <PixelSprite src="basket_goods.png" x={496} y={536} w={68} h={62} />
        <PixelSprite src="basket_goods.png" x={574} y={548} w={68} h={62} />
        <PixelSprite src="basket_goods.png" x={764} y={536} w={68} h={62} />
        <div style={{position: 'absolute', left: 288, top: 222}}>
          <PixelSprite src="portrait_endang_happy.png" w={188} h={388} />
        </div>
        <Walker sprite="villager_blue" path={[[712, 578]]} scale={1.55} idleFacingLeft carryingPhone />
        <PixelChip
          text="PENGECUALIAN YANG JUJUR • HP ADALAH PASAR"
          x={460}
          y={594}
          centerX
          borderColor={PX.blueLight}
          color="#E8F6FF"
          fontSize={10}
        />
      </>
    }
  >
    <CharacterHeaderCard
      portrait="portrait_endang_happy.png"
      name="BU ENDANG"
      role="HASIL TAHUN KE-20"
      verdictText="LEBIH BAIK DI MEKARSARI"
      verdictAccent={PX.blueLight}
      mechanism="PASAR"
      extraBadge="PENGECUALIAN YANG JUJUR"
    />
  </SplitWorldStage>
);

export const B42_VerdictHarjo: React.FC = () => (
  <SplitWorldStage
    leftBg="bg_rumah_makan.png"
    rightBg="bg_rumah_makan.png"
    splitRatio={0.72}
    leftTint="rgba(255, 190, 90, 0.08)"
    rightTint="rgba(20, 48, 92, 0.28)"
    leftContent={
      <>
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 192,
            width: 188,
            height: 242,
            overflow: 'hidden',
          }}
        >
          <PixelSprite src="portrait_harjo_happy.png" w={188} h={388} />
        </div>
        <div style={{position: 'absolute', left: 168, top: 382, width: 68, height: 84, overflow: 'hidden'}}>
          <PixelSprite src="villager_green_walk_0.png" w={60} h={98} />
        </div>
        <div style={{position: 'absolute', left: 562, top: 364, width: 68, height: 82, overflow: 'hidden'}}>
          <PixelSprite src="villager_blue_walk_0.png" w={60} h={98} flipX />
        </div>
        <PixelChip
          text="ANAK-ANAK DEKAT • MALAM PENUH PERCAKAPAN"
          x={460}
          y={590}
          centerX
          borderColor={PX.gold}
          fontSize={10}
        />
      </>
    }
    rightContent={
      <div
        style={{
          position: 'absolute',
          left: 48,
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
    <CharacterHeaderCard
      portrait="portrait_harjo_happy.png"
      name="PAK HARJO"
      role="HASIL TAHUN KE-20"
      verdictText="LEBIH BAIK DI KERTAJAYA"
      verdictAccent={PX.gold}
      mechanism="PERCAKAPAN KELUARGA"
    />
  </SplitWorldStage>
);

export const B43_VerdictTia: React.FC = () => (
  <SplitWorldStage
    leftBg="bg_desa_siang.png"
    rightBg="bg_desa_siang.png"
    splitRatio={0.72}
    leftContent={
      <>
        <div style={{position: 'absolute', left: 374, top: 258}}>
          <PixelSprite src="portrait_tia_happy.png" w={184} h={380} />
        </div>
        {/* Close friends standing grounded on the green foreground meadow (NOT on palm treetops!) */}
        <Walker sprite="villager_red" path={[[226, 636]]} scale={1.55} chatDot />
        <Walker sprite="villager_green" path={[[636, 636]]} scale={1.55} idleFacingLeft chatDot />
        <Walker sprite="villager_blue" path={[[728, 642]]} scale={1.5} idleFacingLeft />
        <PixelChip
          text="TEMAN SEDIKIT • KESEPIANNYA TIDAK ADA"
          x={460}
          y={166}
          centerX
          borderColor={PX.gold}
          fontSize={10}
        />
      </>
    }
    rightContent={
      <div style={{position: 'absolute', left: 96, top: 298}}>
        <PixelSprite src="portrait_tia_phone.png" w={164} h={338} />
      </div>
    }
  >
    <CharacterHeaderCard
      portrait="portrait_tia_happy.png"
      name="TIA"
      role="HASIL TAHUN KE-20"
      verdictText="LEBIH BAIK DI KERTAJAYA"
      verdictAccent={PX.gold}
      mechanism="KUALITAS PERTEMANAN"
    />
  </SplitWorldStage>
);

export const B44_VerdictOmen: React.FC = () => (
  /* BOTH plates equally bright — zero loser label ("dua-duanya tidak buruk") */
  <SplitWorldStage
    leftBg="bg_bengkel.png"
    rightBg="bg_toko_hp.png"
    splitRatio={0.5}
    dimLeft={0}
    dimRight={0}
    leftContent={
      <>
        <div style={{position: 'absolute', left: 196, top: 226}}>
          <PixelSprite src="portrait_omen_happy.png" w={176} h={364} />
        </div>
        <PixelSprite src="radio.png" x={66} y={362} w={74} h={62} />
        <Walker sprite="villager_blue" path={[[406, 580]]} scale={1.4} idleFacingLeft chatDot />
        <Walker sprite="villager_green" path={[[482, 584]]} scale={1.4} idleFacingLeft />
        <Walker sprite="villager_red" path={[[558, 588]]} scale={1.4} idleFacingLeft />
        <PixelChip
          text="BENGKEL BARU • MENGAJARI TIGA ORANG"
          x={320}
          y={594}
          centerX
          borderColor={PX.gold}
          fontSize={9}
        />
      </>
    }
    rightContent={
      <>
        <div style={{position: 'absolute', left: 374, top: 226}}>
          <PixelSprite src="portrait_omen_happy.png" w={176} h={364} flipX />
        </div>
        <Walker sprite="villager_red" path={[[306, 576]]} scale={1.55} carryingPhone chatDot />
        <Walker sprite="villager_blue" path={[[252, 586]]} scale={1.5} carryingPhone />
        <PixelChip
          text="MENYELAMATKAN TETANGGA DARI PENIPUAN"
          x={320}
          y={594}
          centerX
          borderColor={PX.blueLight}
          color="#E4F2FF"
          fontSize={9}
        />
      </>
    }
  >
    <CharacterHeaderCard
      portrait="portrait_omen_happy.png"
      name="BANG OMEN"
      role="DUA JALAN YANG BERBEDA"
      verdictText="DUA-DUANYA TIDAK BURUK"
      verdictAccent={PX.green}
      mechanism="KEAHLIAN YANG BERGANTI FUNGSI"
    />
  </SplitWorldStage>
);
