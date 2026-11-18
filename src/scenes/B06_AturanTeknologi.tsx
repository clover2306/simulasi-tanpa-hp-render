import React from 'react';
import {RuleCardBeat} from '../components/PixelBeats';
import {PX, PixelSprite} from '../components/PixelUI';
import {localF} from '../demoPlan';

const SproutIcon: React.FC = () => (
  <svg width={26} height={26} viewBox="0 0 16 16" style={{flexShrink: 0}}>
    <rect x={7} y={7} width={2} height={7} fill={PX.green} />
    <rect x={3} y={4} width={4} height={3} fill={PX.greenHi} />
    <rect x={9} y={3} width={4} height={3} fill={PX.greenHi} />
    <rect x={4} y={13} width={8} height={2} fill="#8C6239" />
  </svg>
);

export const B06_AturanTeknologi: React.FC = () => (
  <RuleCardBeat
    cfg={{
      ruleNum: 1,
      title: 'TEKNOLOGI',
      dur: 330,
      kevinAt: localF('B06', 74.6),
      mulyadiAt: localF('B06', 78.7),
      kevinItems: [
        {
          label: 'POMPA AIR',
          at: localF('B06', 75.46),
          icon: <PixelSprite src="pump.png" w={28} h={25} />,
        },
        {
          label: 'BIBIT UNGGUL',
          at: localF('B06', 76.5),
          icon: <SproutIcon />,
        },
        {
          label: 'PENGGILINGAN PADI',
          at: localF('B06', 77.44),
          icon: <PixelSprite src="mill.png" w={28} h={24} />,
        },
      ],
      kevinSummary: 'MEMBAWA 3 ALAT MODERN UNTUK MEMPERCEPAT PANEN.',
      mulyadiTitle: 'MELARANG KETIGANYA',
      mulyadiLines: ['PRINSIPNYA SATU:', '"CARA LELUHUR SUDAH CUKUP."'],
      mulyadiStamp: 'DILARANG!',
    }}
  />
);
