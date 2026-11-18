import React from 'react';
import {ShowcaseBeat} from '../components/PixelBeats';
import {PX} from '../components/PixelUI';
import {localF} from '../demoPlan';

export const B02_ShowcaseKevin: React.FC = () => (
  <ShowcaseBeat
    dur={289}
    cfg={{
      who: 'kevin',
      name: 'KEVIN',
      age: '26 TAHUN',
      accent: PX.gold,
      ageColor: PX.blueLight,
      traitPrefix: '>',
      traitColor: PX.goldHi,
      annotations: [
        {label: 'RAMBUT RAPI', x: 34, y: 126, tx: 270, ty: 190},
        {label: 'GULUNGAN RENCANA', x: 26, y: 404, tx: 196, ty: 392},
      ],
      traits: [
        {text: 'VISIONER', at: localF('B02', 16.5)},
        {text: 'MAU MENDENGAR MASUKAN', at: localF('B02', 17.8)},
        {text: 'CEPAT BELAJAR DARI KESALAHAN', at: localF('B02', 19.6)},
      ],
    }}
  />
);
