import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelChip} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';
import {DialogScene, type DialogLine} from '../components/DialogScene';

const DUR = 686; // 307.38 - 330.24s

export const B20_Dialog1_SariMulyadi: React.FC = () => {
  const f = useCurrentFrame();
  const bridgeAt = fullLocalF('B20', 324.65);

  const lines: DialogLine[] = [
    {
      speaker: 'mulyadi',
      fromF: fullLocalF('B20', 307.38),
      toF: fullLocalF('B20', 309.78),
      text: 'Sari! Apa yang kau lakukan di sini?',
    },
    {
      speaker: 'sari',
      fromF: fullLocalF('B20', 310.18),
      toF: fullLocalF('B20', 314.4),
      text: 'Belajar, Pak. Satu pompa bisa mengairi sepuluh sawah dalam sehari.',
    },
    {
      speaker: 'mulyadi',
      fromF: fullLocalF('B20', 314.88),
      toF: fullLocalF('B20', 321.6),
      text: 'Kita tidak butuh itu! Sawah kita hidup dari hujan, seperti zaman bapakmu! Jangan ajari aku cara bertani!',
    },
    {
      speaker: 'sari',
      fromF: fullLocalF('B20', 322.18),
      toF: fullLocalF('B20', 324.4),
      text: 'Tapi Pak, kalau hujannya tidak datang?',
    },
  ];

  if (f >= bridgeAt) {
    return (
      <Sequence from={bridgeAt} durationInFrames={DUR - bridgeAt}>
        <AbsoluteFill>
          <LiveMapBg
            era="y6"
            zoomFrom={1.08}
            zoomTo={1.36}
            dim={0.22}
            dur={DUR - bridgeAt}
            hideIds={['sari', 'mulyadi']}
            extraWalkers={[
              {
                id: 'sari_return',
                sprite: 'sari',
                path: [[520, 396], [614, 396], [614, 368], [666, 368], [680, 396], [780, 396], [780, 316]],
                speed: 44,
                startFrame: 0,
                loopMode: 'once',
                label: 'SARI',
                labelColor: PX.amber,
              },
              {
                id: 'mulyadi_walk_back',
                sprite: 'mulyadi',
                path: [[680, 316], [860, 316]],
                speed: 36,
                startFrame: 0,
                loopMode: 'once',
                label: 'MULYADI',
                labelColor: PX.green,
              },
            ]}
          />
          <PixelChip
            text="DUA TAHUN KEMUDIAN..."
            x={640}
            y={76}
            centerX
            borderColor={PX.amber}
            color={PX.amber}
            fontSize={14}
          />
        </AbsoluteFill>
      </Sequence>
    );
  }

  return <DialogScene dur={bridgeAt} lines={lines} />;
};
