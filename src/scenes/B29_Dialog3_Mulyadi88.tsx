import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {DialogScene, type DialogLine} from '../components/DialogScene';

const DUR = 958; // 513.80 - 545.74s

export const B29_Dialog3_Mulyadi88: React.FC = () => {
  const f = useCurrentFrame();

  const dialogStart = fullLocalF('B29', 524.68);
  const hugAt = fullLocalF('B29', 531.56);
  const year19At = fullLocalF('B29', 537.92);

  if (f < dialogStart) {
    return (
      <AbsoluteFill>
        <LiveMapBg era="y16" zoomFrom={1.06} zoomTo={1.16} panX={[-90, -90]} dim={0.18} dur={dialogStart} />
        {f >= fullLocalF('B29', 515.3) ? (
          <PixelChip
            text="PAK MULYADI • 88 TAHUN"
            x={820}
            y={82}
            centerX
            borderColor={PX.amber}
            color={PX.goldHi}
            fontSize={14}
          />
        ) : null}
      </AbsoluteFill>
    );
  }

  if (f >= year19At) {
    return (
      <Sequence from={year19At} durationInFrames={DUR - year19At}>
        <AbsoluteFill>
          <LiveMapBg era="y16" zoomFrom={1.02} zoomTo={1.12} dim={0.14} dur={DUR - year19At} />
          <PixelChip
            text="TAHUN 19 • KEDUA DESA PANEN RAYA BERSAMAAN"
            x={640}
            y={76}
            centerX
            borderColor={PX.gold}
            fontSize={13}
          />
        </AbsoluteFill>
      </Sequence>
    );
  }

  const lines: DialogLine[] = [
    {
      speaker: 'mulyadi',
      fromF: 0,
      toF: fullLocalF('B29', 527.4) - dialogStart,
      text: 'Aku salah. Bukan teknologinya yang jahat.',
    },
    {
      speaker: 'mulyadi',
      fromF: fullLocalF('B29', 527.58) - dialogStart,
      toF: hugAt - dialogStart,
      text: 'Akunya yang takut. Aku takut dunia berubah, dan aku tidak ikut berubah.',
    },
  ];

  return (
    <Sequence from={dialogStart} durationInFrames={year19At - dialogStart}>
      <DialogScene
        dur={year19At - dialogStart}
        lines={lines}
        hugFromF={hugAt - dialogStart}
        mulyadiLabel="PAK MULYADI • 88 THN"
        mulyadiNeutral
      >
        {/* Key quote card during Dialog 3 */}
        {f >= fullLocalF('B29', 526.2) ? (
          <PixelCard
            x={640}
            y={530}
            w={880}
            center
            borderColor={PX.gold}
            bg="rgba(20, 18, 16, 0.94)"
            pad="12px 18px"
          >
            <div style={{fontSize: 12, color: PX.gold, textAlign: 'center', lineHeight: 1.6}}>
              &quot;BUKAN TEKNOLOGINYA YANG JAHAT — AKUNYA YANG TAKUT&quot;
            </div>
          </PixelCard>
        ) : null}
      </DialogScene>
    </Sequence>
  );
};
