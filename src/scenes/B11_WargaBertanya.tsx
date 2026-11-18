import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {localF} from '../demoPlan';
import {PX, PixelBubble, PixelChip, PixelMapBg} from '../components/PixelUI';

const DUR = 480; // 140.66 - 156.68s

export const B11_WargaBertanya: React.FC = () => {
  const f = useCurrentFrame();

  // Smooth pan from Sinarbaru (left) -> Tanjungsari (right) -> center
  const panX = interpolate(f, [0, 140, 320, DUR], [26, -26, 20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const b1At = localF('B11', 141.0); // "Warga Sinarbaru garuk-garuk kepala"
  const b2At = localF('B11', 144.62); // "Di seberang sungai, Pak Mulyadi tidak mengubah apa-apa"
  const b3At = localF('B11', 149.88); // "Cara lama berjalan seperti 30 tahun terakhir"
  const y2At = localF('B11', 153.5); // "Tahun kedua..."

  return (
    <AbsoluteFill>
      <PixelMapBg
        plate="y2"
        zoomFrom={1.06}
        zoomTo={1.08}
        panX={[panX, panX]}
        dim={0.18}
        dur={DUR}
      />

      {/* Side village tags */}
      <PixelChip text="SINARBARU" x={190} y={76} centerX borderColor={PX.gold} fontSize={12} />
      <PixelChip text="TANJUNGSARI" x={1090} y={76} centerX borderColor={PX.green} fontSize={12} />

      {/* 3 Sequential Question Bubbles over the map (y: 160..540, well clear of HUD and 660 caption zone) */}
      <PixelBubble
        text="BELI ALAT APAAN INI? KOK BINGUNG..."
        x={96}
        y={180}
        maxW={380}
        tail="bottom-left"
        accent={PX.gold}
        at={b1At}
      />

      <PixelBubble
        text="CARA LAMA SAJA. TANPA ALAT BARU!"
        x={760}
        y={210}
        maxW={400}
        tail="bottom-right"
        accent={PX.green}
        at={b2At}
      />

      <PixelBubble
        text="EMANG BAKAL BERHASIL?"
        x={160}
        y={395}
        maxW={360}
        tail="bottom-center"
        accent={PX.blueLight}
        at={b3At}
      />

      {f >= y2At ? (
        <PixelChip
          text="TAHUN 2: BELUM ADA HASIL..."
          x={640}
          y={576}
          centerX
          borderColor={PX.amber}
          color={PX.amber}
          fontSize={13}
        />
      ) : null}
    </AbsoluteFill>
  );
};
