import React from 'react';
import {ShowcaseBeat} from '../components/PixelBeats';
import {PX} from '../components/PixelUI';
import {localF} from '../demoPlan';

export const B03_ShowcaseMulyadi: React.FC = () => (
  <ShowcaseBeat
    dur={298}
    cfg={{
      who: 'mulyadi',
      name: 'PAK MULYADI',
      age: '70 TAHUN',
      accent: PX.green,
      ageColor: PX.amber,
      traitPrefix: 'X',
      traitColor: '#FFD0C4',
      annotations: [
        {label: 'RAMBUT PUTIH', x: 34, y: 126, tx: 270, ty: 190},
        {label: 'TONGKAT', x: 404, y: 404, tx: 360, ty: 410},
      ],
      traits: [
        {text: 'KERAS KEPALA', at: localF('B03', 26.0)},
        {text: 'MERASA BENAR & ANTI KRITIK', at: localF('B03', 27.5)},
        {text: 'TIDAK PERNAH BERPIKIR MAJU', at: localF('B03', 29.8)},
      ],
    }}
  />
);
