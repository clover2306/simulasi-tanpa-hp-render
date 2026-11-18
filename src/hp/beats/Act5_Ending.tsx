import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {W} from '../../lib/tokens';
import {PIXEL_FONT} from '../../pixelFont';
import {PX, PixelCard, PixelChip, PixelSprite} from '../../components/PixelUI';
import {Walker} from '../../components/Walker';
import {pxSnap, step01} from '../plan';
import {DimensionLabelsBar} from '../hud';
import {ParallelMapStage} from '../map';
import {SplitWorldStage} from '../stage';

export const B45_Rerun: React.FC = () => {
  const f = useCurrentFrame();
  // Phases across 575f:
  // 1 (0..85): Pixel rewind (walkers reverse, scanlines)
  // 2 (85..175): New rule ONLY on Kertajaya; Mekarsari marked "ATURAN TIDAK BERUBAH"
  // 3 (175..370): Accelerated replay (no score card during replay); post-Y10 (255..370) tower rises on Kertajaya
  // 4 (370..575): Final result: Kertajaya 86 faded -> 84; Mekarsari 72 stays completely static WITHOUT flip/effect!
  const isRewind = f < 85;
  const isRulePhase = f >= 85 && f < 175;
  const isPostY10 = f >= 255;
  const isResult = f >= 370;

  let wf = 0;
  if (isRewind) {
    wf = Math.max(0, Math.round(520 - f * 6));
  } else if (f >= 175 && f < 370) {
    wf = (f - 175) * 4;
  } else if (isResult) {
    wf = 780 + (f - 370);
  }

  const kReplacedWith84 = f >= 416;

  return (
    <ParallelMapStage
      focus="dual"
      dimAll={isRulePhase || isResult ? 0.48 : 0.14}
      showKertajayaRerunTower={isPostY10}
      marketTier={f >= 230 ? 2 : 0}
      frameOverride={wf}
    >
      {/* Phase 1: Pixel Rewind Overlay */}
      {isRewind ? (
        <>
          {[140, 260, 380, 500].map((ry) => (
            <div
              key={ry}
              style={{
                position: 'absolute',
                left: 0,
                top: ry + ((f * 5) % 24),
                width: W,
                height: 4,
                background: 'rgba(255, 220, 120, 0.28)',
                zIndex: 44,
              }}
            />
          ))}
          <PixelCard
            x={W / 2}
            y={340}
            w={620}
            center
            borderColor={PX.gold}
            bg="rgba(18, 16, 14, 0.96)"
            pad="18px 26px"
            style={{zIndex: 46, textAlign: 'center'}}
          >
            <div style={{fontSize: 18, color: PX.gold}}>&lt;&lt; JALANKAN ULANG SIMULASI</div>
            <div style={{fontSize: 10, color: PX.white, marginTop: 10}}>
              KEMBALI KE HARI PERTAMA
            </div>
          </PixelCard>
        </>
      ) : null}

      {/* Persistent lock marker on Mekarsari from rule phase through replay (Pagar 4) */}
      {f >= 85 && f < 370 ? (
        <PixelChip
          text="[KUNCI] MEKARSARI: ATURAN TIDAK BERUBAH"
          x={960}
          y={72}
          centerX
          borderColor="#5A728A"
          color="#C8DCF0"
          bg="rgba(14, 20, 28, 0.94)"
          fontSize={9}
          style={{zIndex: 46}}
        />
      ) : null}

      {/* Phase 2: New Rule Card ONLY on Kertajaya side */}
      {isRulePhase ? (
        <PixelCard
          x={320}
          y={340}
          w={520}
          center
          borderColor={PX.gold}
          bg="rgba(22, 18, 14, 0.97)"
          pad="22px 24px"
          style={{zIndex: 46, textAlign: 'center'}}
        >
          <div style={{fontSize: 11, color: PX.gold, marginBottom: 12}}>
            SATU PERUBAHAN DI KERTAJAYA
          </div>
          <div style={{fontSize: 15, color: PX.white, lineHeight: 1.7}}>
            HP DIIZINKAN SETELAH TAHUN KE-10
          </div>
        </PixelCard>
      ) : null}

      {/* Phase 3: Accelerated Replay status on Kertajaya */}
      {f >= 175 && f < 370 ? (
        <PixelChip
          text={
            isPostY10
              ? 'THN 11–20: HP MASUK • FOKUS AWAL TETAP BERTAHAN'
              : 'THN 1–10: SEPULUH TAHUN PERTAMA TANPA HP'
          }
          x={320}
          y={588}
          centerX
          borderColor={PX.gold}
          color={PX.goldHi}
          fontSize={9}
          style={{zIndex: 46}}
        />
      ) : null}

      {/* Phase 4: Counterfactual Final Score 84 vs 72 (Mekarsari 72 has ZERO flip/effect — Pagar 4!) */}
      {isResult ? (
        <div style={{position: 'absolute', inset: 0, zIndex: 47, pointerEvents: 'none'}}>
          <PixelChip
            text="HASIL ULANG KONTRAFAKTUAL • TAHUN KE-20"
            x={W / 2}
            y={114}
            centerX
            borderColor={PX.gold}
            fontSize={13}
          />

          {/* Left Card: Kertajaya 86 faded -> replaced directly by 84 */}
          <PixelCard
            x={120}
            y={198}
            w={440}
            h={218}
            borderColor={PX.gold}
            bg="rgba(22, 19, 15, 0.96)"
            pad="22px 26px"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontSize: 15, color: PX.gold}}>KERTAJAYA</div>
            <div style={{fontSize: 9, color: '#C8BCA8'}}>HP DIIZINKAN SETELAH THN 10</div>
            {!kReplacedWith84 ? (
              <div
                style={{
                  fontSize: 46,
                  color: PX.goldHi,
                  opacity: 0.34,
                  textDecoration: 'line-through',
                }}
              >
                86
              </div>
            ) : (
              <div style={{fontSize: 50, color: PX.goldHi, textShadow: '4px 4px 0 #000'}}>84</div>
            )}
            <div style={{fontSize: 9, color: PX.green}}>&gt; TETAP UNGGUL</div>
          </PixelCard>

          {/* Right Card: Mekarsari 72 COMPLETELY STATIC without flip or any effect */}
          <PixelCard
            x={720}
            y={198}
            w={440}
            h={218}
            borderColor="#4E6276"
            bg="rgba(16, 22, 30, 0.96)"
            pad="22px 26px"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontSize: 15, color: PX.blueLight}}>MEKARSARI</div>
            <div style={{fontSize: 9, color: '#9AB2CA'}}>ATURAN TIDAK BERUBAH</div>
            <div style={{fontSize: 50, color: '#E8F4FF', textShadow: '4px 4px 0 #000'}}>72</div>
            <div style={{fontSize: 9, color: '#869CB2'}}>TETAP SAMA</div>
          </PixelCard>

          <PixelCard
            x={W / 2}
            y={518}
            w={880}
            center
            borderColor={PX.gold}
            bg="rgba(18, 16, 14, 0.96)"
            pad="16px 24px"
            style={{textAlign: 'center'}}
          >
            <div style={{fontSize: 13, color: PX.gold}}>
              SEPULUH TAHUN PERTAMA YANG PALING MENENTUKAN
            </div>
            <div style={{fontSize: 10, color: PX.white, marginTop: 8}}>
              Fokus yang dibangun di awal tidak mudah dikejar.
            </div>
          </PixelCard>
        </div>
      ) : null}
    </ParallelMapStage>
  );
};

export const B46_SeratusKali: React.FC = () => {
  const f = useCurrentFrame();
  // 3 beats across 691f (ZERO 100-box grid, ZERO bars, ZERO pie, ZERO readable intermediate digits!):
  // 1 (0..195): Rapid world shuffle -> counter spins non-numeric scramble blocks & locks on 100 at f=148
  // 2 (195..430): 3 Tally Cards lock on 87, 11, 2
  // 3 (430..691): Pattern when Mekarsari wins (booming stall + clean of scam bubbles) as 2 text cards
  const beat = f < 195 ? 1 : f < 430 ? 2 : 3;

  // Stepped shuffle seed during beat 1
  const shuffleStep = Math.floor(f / 5);
  const wf = beat === 1 ? shuffleStep * 43 : f;
  const weatherFlash = beat === 1 && f < 148 && shuffleStep % 3 === 0 ? 0.12 : 0;

  // Non-readable pixel scramble glyphs before locking onto exact allowed numbers (Pagar 2 & Brief A7)
  const scramble2 = shuffleStep % 2 === 0 ? '##' : '**';
  const scramble3 = shuffleStep % 2 === 0 ? '###' : '***';

  return (
    <ParallelMapStage
      focus={beat === 3 ? 'right' : 'dual'}
      focusStrength={beat === 3 ? step01(f, 430, 468, 8) * 0.8 : 0}
      dimAll={beat === 2 ? 0.62 : beat === 1 ? 0.34 + weatherFlash : 0.28}
      marketTier={beat === 3 ? 2 : 1}
      cleanMekarsariBubbles={beat === 3}
      frameOverride={wf}
    >
      {beat === 1 ? (
        <PixelCard
          x={W / 2}
          y={340}
          w={680}
          center
          borderColor={PX.gold}
          bg="rgba(18, 16, 14, 0.96)"
          pad="26px 32px"
          style={{zIndex: 47, textAlign: 'center'}}
        >
          <div style={{fontSize: 12, color: PX.gold, marginBottom: 14}}>
            DIULANG DENGAN NASIB ACAK BERBEDA-BEDA
          </div>
          <div style={{fontSize: 48, color: PX.white, textShadow: '4px 4px 0 #000'}}>
            {f >= 145 ? '100' : scramble3}
          </div>
          <div style={{fontSize: 11, color: PX.goldHi, marginTop: 14}}>KALI PENGULANGAN</div>
        </PixelCard>
      ) : beat === 2 ? (
        /* Three Tally Cards ONLY — no grid, no bar, no pie (Pagar 7) */
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 214,
            translate: '-50% 0',
            display: 'flex',
            gap: 24,
            zIndex: 47,
          }}
        >
          <PixelCard
            w={350}
            h={240}
            borderColor={PX.gold}
            bg="rgba(22, 19, 14, 0.97)"
            pad="24px 22px"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontSize: 14, color: PX.gold, textAlign: 'center'}}>KERTAJAYA MENANG</div>
            <div style={{fontSize: 52, color: PX.goldHi, textShadow: '4px 4px 0 #000'}}>
              {f >= 224 ? '87' : scramble2}
            </div>
            <div style={{fontSize: 11, color: '#C8BCA8'}}>KALI</div>
          </PixelCard>

          <PixelCard
            w={350}
            h={240}
            borderColor={PX.blueLight}
            bg="rgba(14, 22, 32, 0.97)"
            pad="24px 22px"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontSize: 14, color: PX.blueLight, textAlign: 'center'}}>
              MEKARSARI MENANG
            </div>
            <div style={{fontSize: 52, color: '#E8F4FF', textShadow: '4px 4px 0 #000'}}>
              {f >= 246 ? '11' : scramble2}
            </div>
            <div style={{fontSize: 11, color: '#9AB2CA'}}>KALI</div>
          </PixelCard>

          <PixelCard
            w={280}
            h={240}
            borderColor="#8A8278"
            bg="rgba(20, 20, 20, 0.97)"
            pad="24px 22px"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontSize: 14, color: '#E0DAD0', textAlign: 'center'}}>SERI</div>
            <div style={{fontSize: 52, color: PX.white, textShadow: '4px 4px 0 #000'}}>
              {f >= 268 ? '2' : '*'}
            </div>
            <div style={{fontSize: 11, color: '#A8A096'}}>KALI</div>
          </PixelCard>
        </div>
      ) : (
        /* Beat 3: Two short pattern cards when Mekarsari wins */
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 132,
            translate: '-50% 0',
            width: 860,
            zIndex: 47,
          }}
        >
          <PixelChip
            text="DI DUNIA SAAT MEKARSARI MENANG, SELALU ADA DUA HAL:"
            x={430}
            y={0}
            centerX
            borderColor={PX.blueLight}
            color="#E8F6FF"
            fontSize={11}
          />
          <div style={{display: 'flex', gap: 22, marginTop: 58}}>
            <PixelCard
              w={419}
              borderColor={PX.green}
              bg="rgba(14, 24, 18, 0.96)"
              pad="20px 22px"
            >
              <div style={{fontSize: 14, color: PX.green, marginBottom: 10}}>
                &gt; DAGANGNYA MELEDAK
              </div>
              <div style={{fontSize: 10, color: '#D8F6E0', lineHeight: 1.6}}>
                Pasar Bu Endang tumbuh pesat lewat sinyal.
              </div>
            </PixelCard>
            <PixelCard
              w={419}
              borderColor={PX.blueLight}
              bg="rgba(14, 22, 32, 0.96)"
              pad="20px 22px"
            >
              <div style={{fontSize: 14, color: PX.blueLight, marginBottom: 10}}>
                &gt; GELOMBANGNYA TIDAK DATANG
              </div>
              <div style={{fontSize: 10, color: '#D8ECFF', lineHeight: 1.6}}>
                Desa bersih dari gelombang penipuan.
              </div>
            </PixelCard>
          </div>
        </div>
      )}
    </ParallelMapStage>
  );
};

export const B47_Dekomposisi: React.FC = () => (
  /* 4 dimension icons: belajar + hubungan glow on K, usaha glows on M, kesehatan neutral. Zero numbers/scales! */
  <ParallelMapStage focus="dual" dimAll={0.54} marketTier={2}>
    <PixelCard
      x={W / 2}
      y={146}
      w={860}
      center
      borderColor={PX.gold}
      bg="rgba(18, 16, 14, 0.96)"
      pad="16px 26px"
      style={{zIndex: 46, textAlign: 'center'}}
    >
      <div style={{fontSize: 14, color: PX.gold}}>POLANYA SELALU SAMA</div>
      <div style={{fontSize: 10, color: PX.white, marginTop: 8}}>
        Kekuatan nyala menandai penyumbang selisih terbesar
      </div>
    </PixelCard>

    <DimensionLabelsBar y={272} glowK={['belajar', 'hubungan']} glowM={['usaha']} />

    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 438,
        translate: '-50% 0',
        display: 'flex',
        gap: 28,
        zIndex: 46,
      }}
    >
      <PixelCard w={420} borderColor={PX.gold} bg="rgba(22, 18, 12, 0.95)" pad="14px 18px">
        <div style={{fontSize: 11, color: PX.gold, textAlign: 'center'}}>
          &gt; BELAJAR &amp; HUBUNGAN: KERTAJAYA
        </div>
      </PixelCard>
      <PixelCard w={420} borderColor={PX.blueLight} bg="rgba(14, 22, 32, 0.95)" pad="14px 18px">
        <div style={{fontSize: 11, color: PX.blueLight, textAlign: 'center'}}>
          &gt; USAHA MENARIK KE: MEKARSARI
        </div>
      </PixelCard>
    </div>
  </ParallelMapStage>
);

export const B48_JawabanInti: React.FC = () => {
  const f = useCurrentFrame();
  const showAnswer = f >= 120;

  // Ambient pixel particles of "perhatian" (tiny 6x6 pixel motes — NOT arrows or labeled diagrams! Brief A8b)
  const kMotes = [0, 1, 2, 3, 4, 5, 6, 7];
  const mMotes = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <SplitWorldStage
      leftBg="bg_desa_siang.png"
      rightBg="bg_desa_siang.png"
      splitRatio={0.5}
      leftContent={
        <>
          {/* All figures grounded on the green foreground meadow (y=626..642) */}
          <Walker sprite="dika" path={[[128, 626]]} scale={1.45} chatDot />
          <Walker sprite="harjo" path={[[302, 636]]} scale={1.45} chatDot />
          <Walker sprite="villager_blue" path={[[356, 642]]} scale={1.08} idleFacingLeft />
          <Walker sprite="tia" path={[[482, 628]]} scale={1.42} chatDot />
          <Walker sprite="villager_green" path={[[538, 634]]} scale={1.42} idleFacingLeft />

          {/* Warm gold attention motes drifting between villagers (learning, family, neighbors — NO arrows/diagrams!) */}
          {showAnswer
            ? kMotes.map((i) => {
                const u = ((f * 0.9 + i * 19) % 90) / 90;
                const anchors: Array<[number, number, number, number]> = [
                  [302, 566, 132, 558],
                  [132, 558, 354, 588],
                  [302, 566, 484, 560],
                  [484, 560, 536, 566],
                ];
                const [sx, sy, tx, ty] = anchors[i % anchors.length];
                const mx = pxSnap(sx + (tx - sx) * u, 2);
                const my = pxSnap(sy + (ty - sy) * u - Math.sin(u * Math.PI) * 24, 2);
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: mx,
                      top: my,
                      width: 6,
                      height: 6,
                      background: PX.gold,
                      boxShadow: '0 0 0 1px #141210',
                    }}
                  />
                );
              })
            : null}

          <PixelChip
            text="PERHATIAN KEMBALI KE BELAJAR, KELUARGA, TETANGGA"
            x={320}
            y={236}
            centerX
            borderColor={PX.gold}
            fontSize={9}
          />
        </>
      }
      rightContent={
        <>
          {/* Grounded on the green foreground meadow */}
          <Walker sprite="endang" path={[[124, 626]]} scale={1.45} carryingPhone />
          <PixelSprite src="basket_goods.png" x={168} y={584} w={52} h={48} />
          <PixelSprite src="hp_hand.png" x={294} y={492} w={52} h={66} />
          <Walker sprite="tia" path={[[474, 634]]} scale={1.42} idleFacingLeft carryingPhone />
          <Walker
            sprite="villager_red"
            path={[[538, 628]]}
            scale={1.42}
            idleFacingLeft
            carryingPhone
            desaturated
          />

          {/* Attention motes go into screen -> half to Endang's trade (gold), half to anxiety (red) */}
          {showAnswer
            ? mMotes.map((i) => {
                const u = ((f * 1.1 + i * 17) % 90) / 90;
                const toScreen = u < 0.5;
                const v = toScreen ? u * 2 : (u - 0.5) * 2;
                const fromX = i % 2 === 0 ? 128 : 476;
                const destX = i % 2 === 0 ? 182 : 512;
                const destY = i % 2 === 0 ? 592 : 566;
                const mx = toScreen
                  ? pxSnap(fromX + (320 - fromX) * v, 2)
                  : pxSnap(320 + (destX - 320) * v, 2);
                const my = toScreen
                  ? pxSnap(562 + (522 - 562) * v, 2)
                  : pxSnap(522 + (destY - 522) * v, 2);
                const col = toScreen ? PX.blueLight : i % 2 === 0 ? PX.gold : PX.red;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: mx,
                      top: my,
                      width: 6,
                      height: 6,
                      background: col,
                      boxShadow: '0 0 0 1px #141210',
                    }}
                  />
                );
              })
            : null}

          <PixelChip
            text="PERHATIAN KE LAYAR: KADANG USAHA, KADANG KECEMASAN"
            x={320}
            y={236}
            centerX
            borderColor={PX.blueLight}
            color="#E4F2FF"
            fontSize={9}
          />
        </>
      }
    >
      <PixelCard
        x={W / 2}
        y={134}
        w={900}
        center
        borderColor={PX.gold}
        bg="rgba(18, 16, 14, 0.96)"
        pad="18px 28px"
        style={{zIndex: 48, textAlign: 'center'}}
      >
        {!showAnswer ? (
          <>
            <div style={{fontSize: 10, color: PX.gold, marginBottom: 10}}>
              PERTANYAAN YANG DISIMPAN DIBUKA KEMBALI
            </div>
            <div style={{fontSize: 15, color: PX.white, lineHeight: 1.6}}>
              Jadi, yang tanpa HP lebih bahagia, atau justru tertinggal?
            </div>
          </>
        ) : (
          <>
            <div style={{fontSize: 14, color: PX.gold, marginBottom: 10}}>
              TERGANTUNG APA YANG HP GANTIKAN: PERHATIAN
            </div>
            <div style={{fontSize: 10, color: PX.white, lineHeight: 1.6}}>
              HP menggantikan perhatian — dan perhatian menentukan ke mana hidup bergerak.
            </div>
          </>
        )}
      </PixelCard>
    </SplitWorldStage>
  );
};

export const B49_MusuhDuniaKita: React.FC = () => {
  const f = useCurrentFrame();
  // Part 1 (0..139, 649.64s..654.26s): "HP bukan musuhnya" — one large neutral unlit HP sprite
  // Part 2 (139..726, 654.26s..673.84s): "Di dunia kita..." — Allcott callback card + "Tidak ada yang gratis"
  const part2 = f >= 139;
  const showFinalThesis = f >= 445;

  return (
    <SplitWorldStage
      leftBg="bg_desa_siang.png"
      rightBg="bg_desa_siang.png"
      splitRatio={0.5}
      dimAll={0.62}
      showSideTags={false}
    >
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 47,
          pointerEvents: 'none',
        }}
      >
        {!part2 ? (
          <PixelCard
            w={820}
            borderColor="#9A9286"
            bg="rgba(18, 17, 16, 0.97)"
            pad="30px 36px"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              textAlign: 'center',
            }}
          >
            {/* Neutral large HP sprite without glow */}
            <div
              style={{
                background: '#242220',
                border: '3px solid #6E685F',
                padding: '18px 26px',
              }}
            >
              <PixelSprite
                src="hp_table.png"
                w={126}
                h={90}
                style={{filter: 'saturate(0.35) brightness(0.92)'}}
              />
            </div>
            <div style={{fontSize: 22, color: PX.white}}>HP BUKAN MUSUHNYA.</div>
            <div style={{fontSize: 12, color: '#DDD5C8', lineHeight: 1.7}}>
              Yang menentukan adalah apa yang kamu korbankan untuknya.
            </div>
          </PixelCard>
        ) : (
          <PixelCard w={920} borderColor={PX.gold} bg="rgba(18, 16, 14, 0.97)" pad="28px 36px">
            <div style={{fontSize: 10, color: PX.gold, marginBottom: 12}}>
              INGAT EKSPERIMEN DI DUNIA NYATA (ALLCOTT DKK., 2020)
            </div>
            <div style={{fontSize: 13, color: PX.white, lineHeight: 1.8}}>
              &gt; Ribuan orang berhenti media sosial empat minggu dan merasa lebih baik
            </div>
            <div style={{fontSize: 13, color: '#FFD8CC', lineHeight: 1.8, marginTop: 10}}>
              &gt; Catatannya satu: mereka jadi kurang tahu berita
            </div>

            {showFinalThesis ? (
              <div
                style={{
                  marginTop: 24,
                  background: '#2B2113',
                  border: `3px solid ${PX.gold}`,
                  padding: '18px 22px',
                  textAlign: 'center',
                }}
              >
                <div style={{fontSize: 16, color: PX.gold, lineHeight: 1.65}}>
                  TIDAK ADA YANG GRATIS.
                </div>
                <div style={{fontSize: 12, color: PX.white, marginTop: 10, lineHeight: 1.65}}>
                  Yang ada hanya pilihan — dan harga dari pilihan itu.
                </div>
              </div>
            ) : null}
          </PixelCard>
        )}
      </AbsoluteFill>
    </SplitWorldStage>
  );
};

export const B50_CTA: React.FC = () => (
  /* Idle villages + banners + comment/subscribe CTA cards. ZERO character walks toward either village (Pagar 1)! */
  <SplitWorldStage
    leftBg="bg_desa_siang.png"
    rightBg="bg_desa_siang.png"
    splitRatio={0.5}
    dimAll={0.32}
    showSideTags={false}
    leftContent={
      <>
        <Walker sprite="dika" path={[[112, 628]]} scale={1.45} />
        <Walker sprite="tia" path={[[528, 628]]} scale={1.45} idleFacingLeft />
        <PixelCard
          x={320}
          y={114}
          w={420}
          center
          borderColor={PX.gold}
          bg="rgba(22, 18, 12, 0.95)"
          pad="12px 18px"
          style={{textAlign: 'center'}}
        >
          <div style={{fontSize: 16, color: PX.gold}}>DESA KERTAJAYA</div>
          <div style={{fontSize: 9, color: PX.goldHi, marginTop: 6}}>TANPA HP TOTAL</div>
        </PixelCard>
      </>
    }
    rightContent={
      <>
        <Walker sprite="endang" path={[[112, 628]]} scale={1.45} carryingPhone />
        <Walker sprite="omen" path={[[528, 628]]} scale={1.45} idleFacingLeft />
        <PixelCard
          x={320}
          y={114}
          w={420}
          center
          borderColor={PX.blueLight}
          bg="rgba(14, 22, 32, 0.95)"
          pad="12px 18px"
          style={{textAlign: 'center'}}
        >
          <div style={{fontSize: 16, color: PX.blueLight}}>DESA MEKARSARI</div>
          <div style={{fontSize: 9, color: '#E0F0FF', marginTop: 6}}>BEBAS HP TANPA BATAS</div>
        </PixelCard>
      </>
    }
  >
    <PixelCard
      x={W / 2}
      y={342}
      w={860}
      center
      borderColor={PX.gold}
      bg="rgba(18, 16, 14, 0.97)"
      pad="26px 32px"
      style={{zIndex: 48, textAlign: 'center'}}
    >
      <div style={{fontSize: 16, color: PX.white, lineHeight: 1.75}}>
        Kalau kamu bisa memilih, kamu tinggal di desa yang mana — Kertajaya atau Mekarsari?
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 22,
        }}
      >
        <div
          style={{
            background: '#2A2012',
            border: `3px solid ${PX.gold}`,
            padding: '10px 18px',
            fontSize: 11,
            color: PX.gold,
          }}
        >
          &gt; TULIS DI KOMENTAR
        </div>
        <div
          style={{
            background: '#2E1414',
            border: `3px solid ${PX.red}`,
            padding: '10px 18px',
            fontSize: 11,
            color: '#FFD8D0',
          }}
        >
          &gt; SUBSCRIBE SIMULASI BERIKUTNYA
        </div>
      </div>
    </PixelCard>
  </SplitWorldStage>
);

export const B51_Penutup: React.FC = () => {
  const f = useCurrentFrame();
  // 0..395: Two parallel dinners of Pak Harjo (identical dishes; M: HP stays in pocket!)
  // 395..595: Pull back to full dual night village plates with warm lit house windows; HUD fades out!
  const pullback = f >= 395;
  const pullU = step01(f, 395, 455, 10);
  const talkOpen = Math.floor(f / 8) % 2 === 0;

  // Quiet small hand hesitation toward pocket in Mekarsari (150..240), then returns to table
  const handReach =
    f >= 150 && f < 245
      ? f < 198
        ? step01(f, 150, 195, 6)
        : 1 - step01(f, 198, 245, 6)
      : 0;

  if (pullback) {
    const nightScale = 1.12 - 0.12 * pullU;
    return (
      <SplitWorldStage
        leftBg="bg_malam.png"
        rightBg="bg_malam.png"
        splitRatio={0.5}
        leftScale={nightScale}
        rightScale={nightScale}
        leftTint="rgba(255, 195, 95, 0.06)"
        rightTint="rgba(255, 195, 95, 0.06)"
        showSideTags={false}
      />
    );
  }

  return (
    <SplitWorldStage
      leftBg="bg_rumah_makan.png"
      rightBg="bg_rumah_makan.png"
      splitRatio={0.5}
      leftScale={1.04}
      rightScale={1.04}
      leftTint="rgba(255, 190, 95, 0.1)"
      rightTint="rgba(255, 185, 95, 0.06)"
      leftContent={
        <>
          {/* Kertajaya: Pak Harjo + grown child + young grandchild seated at dining table, ZERO HP */}
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
              src={talkOpen ? 'portrait_harjo_open.png' : 'portrait_harjo_happy.png'}
              w={172}
              h={355}
            />
          </div>
          {/* Grown child seated left chair */}
          <div style={{position: 'absolute', left: 26, top: 378, width: 68, height: 88, overflow: 'hidden'}}>
            <PixelSprite src="villager_blue_walk_0.png" w={60} h={98} />
          </div>
          {/* Young dark-haired grandchild seated right chair */}
          <div style={{position: 'absolute', left: 424, top: 382, width: 52, height: 66, overflow: 'hidden'}}>
            <PixelSprite src="villager_green_walk_0.png" w={44} h={72} flipX />
          </div>

          <PixelChip
            text="MAKAN MALAM BERSAMA ANAK & CUCU • TANPA HP"
            x={320}
            y={590}
            centerX
            borderColor={PX.gold}
            fontSize={9}
          />
        </>
      }
      rightContent={
        <>
          {/* Mekarsari: Same Pak Harjo & family; HP silhouette stays in shirt pocket */}
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
              src={f >= 235 && talkOpen ? 'portrait_harjo_open.png' : 'portrait_harjo_happy.png'}
              w={172}
              h={355}
            />
          </div>
          <div style={{position: 'absolute', left: 26, top: 378, width: 68, height: 88, overflow: 'hidden'}}>
            <PixelSprite src="villager_blue_walk_0.png" w={60} h={98} />
          </div>
          <div style={{position: 'absolute', left: 424, top: 382, width: 52, height: 66, overflow: 'hidden'}}>
            <PixelSprite src="villager_green_walk_0.png" w={44} h={72} flipX />
          </div>

          {/* Faint HP silhouette in Pak Harjo's shirt pocket + quiet hand pause that returns to table */}
          <div
            style={{
              position: 'absolute',
              left: 256,
              top: 344,
              width: 22,
              height: 30,
              border: '2px dashed rgba(140, 200, 255, 0.58)',
              background: 'rgba(14, 24, 36, 0.58)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{width: 10, height: 14, background: 'rgba(140, 200, 255, 0.36)'}} />
          </div>
          {/* Quiet single message chime left unanswered */}
          {f >= 142 && f < 216 ? (
            <PixelSprite
              src="bubble_msg.png"
              x={284}
              y={334}
              w={26}
              h={20}
              style={{opacity: 0.42}}
            />
          ) : null}
          <div
            style={{
              position: 'absolute',
              left: pxSnap(232 + 22 * handReach, 2),
              top: pxSnap(398 - 26 * handReach, 2),
              width: 12,
              height: 12,
              background: '#E2A87C',
              border: '2px solid #1E1814',
            }}
          />

          <PixelChip
            text="HP ADA DI SAKU • MALAM INI TIDAK DIKELUARKAN"
            x={320}
            y={590}
            centerX
            borderColor={PX.blueLight}
            color="#E4F2FF"
            fontSize={9}
          />
        </>
      }
    />
  );
};

export const B52_KalimatAkhir: React.FC = () => {
  const f = useCurrentFrame();
  // Hold sentence steadily (0..86f), then fade cleanly to black (86..113f)
  const fadeBlack = step01(f, 86, 111, 10);

  return (
    <AbsoluteFill>
      <SplitWorldStage
        leftBg="bg_malam.png"
        rightBg="bg_malam.png"
        splitRatio={0.5}
        dimAll={0.58}
        showSideTags={false}
      >
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            pointerEvents: 'none',
          }}
        >
          <PixelCard
            w={880}
            borderColor={PX.gold}
            bg="rgba(16, 14, 12, 0.97)"
            pad="32px 38px"
            style={{textAlign: 'center'}}
          >
            <div style={{fontSize: 20, color: PX.gold, lineHeight: 1.7}}>
              Semua ini simulasi.
            </div>
            <div style={{fontSize: 15, color: PX.white, marginTop: 16, lineHeight: 1.7}}>
              Angkanya fiktif, mekanismenya nyata.
            </div>
          </PixelCard>
        </AbsoluteFill>
      </SplitWorldStage>

      {fadeBlack > 0 ? (
        <AbsoluteFill style={{backgroundColor: '#000', opacity: fadeBlack, zIndex: 90}} />
      ) : null}
      <div style={{display: 'none', fontFamily: PIXEL_FONT}} />
    </AbsoluteFill>
  );
};
