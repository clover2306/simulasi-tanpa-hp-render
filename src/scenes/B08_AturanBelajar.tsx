import React from 'react';
import {RuleCardBeat} from '../components/PixelBeats';
import {localF} from '../demoPlan';

export const B08_AturanBelajar: React.FC = () => (
  <RuleCardBeat
    cfg={{
      ruleNum: 3,
      title: 'BELAJAR',
      dur: 387,
      kevinAt: localF('B08', 99.0),
      mulyadiAt: localF('B08', 104.78),
      kevinItems: [
        {
          label: 'WAJIB PELATIHAN PETANI',
          at: localF('B08', 100.38),
        },
        {
          label: 'SALAH? PERTAMA MENGAKU',
          at: localF('B08', 102.14),
        },
      ],
      kevinSummary: 'TERBUKA PADA MASUKAN & CEPAT PERBAIKI KESALAHAN.',
      mulyadiTitle: 'PENGALAMAN SUDAH CUKUP',
      mulyadiLines: ['ANTI KRITIK.', '"KRITIK DIANGGAP', 'SERANGAN PRIBADI."'],
      mulyadiStamp: 'ANTI KRITIK',
    }}
  />
);
