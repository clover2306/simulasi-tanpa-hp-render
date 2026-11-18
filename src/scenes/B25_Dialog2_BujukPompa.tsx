import React from 'react';
import {fullLocalF} from '../fullPlan';
import {DialogScene, type DialogLine} from '../components/DialogScene';

const DUR = 589; // 415.44 - 435.06s

export const B25_Dialog2_BujukPompa: React.FC = () => {
  const lines: DialogLine[] = [
    {
      speaker: 'sari',
      fromF: fullLocalF('B25', 415.44),
      toF: fullLocalF('B25', 421.8),
      text: 'Pak, tinggal kita yang bertahan. Ayolah, izinkan satu pompa saja. Satu.',
    },
    {
      speaker: 'mulyadi',
      fromF: fullLocalF('B25', 422.84),
      toF: fullLocalF('B25', 426.4),
      text: '...Kalau aku mengizinkan, berarti 30 tahun aku salah.',
    },
    {
      speaker: 'sari',
      fromF: fullLocalF('B25', 427.2),
      toF: fullLocalF('B25', 434.2),
      text: 'Tidak, Pak. Berarti 30 tahun Bapak menjaga desa ini. Dan sekarang giliran Bapak belajar satu hal baru.',
    },
  ];

  return <DialogScene dur={DUR} lines={lines} mulyadiNeutral />;
};
