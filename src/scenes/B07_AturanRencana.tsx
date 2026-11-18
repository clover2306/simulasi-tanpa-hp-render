import React from 'react';
import {RuleCardBeat} from '../components/PixelBeats';
import {PX} from '../components/PixelUI';
import {localF} from '../demoPlan';

const ScrollIcon: React.FC = () => (
  <svg width={24} height={24} viewBox="0 0 16 16" style={{flexShrink: 0}}>
    <rect x={3} y={2} width={10} height={12} fill={PX.goldHi} stroke={PX.goldShadow} strokeWidth={1.5} />
    <rect x={5} y={5} width={6} height={2} fill={PX.ink} />
    <rect x={5} y={9} width={6} height={2} fill={PX.ink} />
  </svg>
);

export const B07_AturanRencana: React.FC = () => (
  <RuleCardBeat
    cfg={{
      ruleNum: 2,
      title: 'RENCANA',
      dur: 389,
      kevinAt: localF('B07', 86.0),
      mulyadiAt: localF('B07', 89.44),
      kevinItems: [
        {
          label: 'RENCANA 10 TAHUN',
          at: localF('B07', 86.96),
          icon: <ScrollIcon />,
        },
        {
          label: 'DITULIS & DIHITUNG',
          at: localF('B07', 88.1),
        },
      ],
      kevinSummary: 'SETIAP LANGKAH PUNYA TARGET DAN PERHITUNGAN JELAS.',
      mulyadiTitle: 'TIDAK PUNYA RENCANA',
      mulyadiLines: ['IKUT MUSIM.', '"TANAM TAHUN INI,', 'TAHUN DEPAN DIPIKIR NANTI."'],
      mulyadiStamp: 'IKUT MUSIM',
    }}
  />
);
