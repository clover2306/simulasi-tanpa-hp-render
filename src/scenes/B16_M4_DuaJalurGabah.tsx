import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelMapBg, PixelSprite} from '../components/PixelUI';

const DUR = 296; // 244.16 - 254.02s

export const B16_M4_DuaJalurGabah: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const oldEnd = fullLocalF('B16', 250.2);
  const newStart = fullLocalF('B16', 246.4);
  const marketStart = fullLocalF('B16', 251.5);

  const oldU = interpolate(f, [18, oldEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const newU = interpolate(f, [newStart, DUR - 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const coinS = spring({
    frame: Math.max(0, f - (DUR - 52)),
    fps,
    config: {damping: 12, stiffness: 200},
  });

  const oldPacketX = interpolate(oldU, [0, 1], [110, 560]);
  const newPacketX = interpolate(newU, [0, 1], [110, 740]);

  return (
    <AbsoluteFill>
      <PixelMapBg plate="y2" zoomFrom={1.0} zoomTo={1.04} dim={0.58} blurPx={3} dur={DUR} />

      <PixelChip
        text="M4 • DUA JALUR GABAH"
        x={640}
        y={72}
        centerX
        borderColor={PX.gold}
        fontSize={14}
      />

      {/* Top lane: JALUR LAMA -> TENGKULAK -> Koin kecil */}
      <PixelCard x={84} y={134} w={1112} h={210} borderColor={PX.red} pad="18px 26px">
        <div style={{fontSize: 14, color: PX.red}}>JALUR LAMA: JUAL GABAH MENTAH</div>
        <div style={{position: 'relative', height: 132, marginTop: 14}}>
          {/* Track */}
          <div style={{position: 'absolute', left: 40, right: 140, top: 68, height: 6, background: '#3B342D'}} />
          {/* Start farmer */}
          <div style={{position: 'absolute', left: 30, top: 24, textAlign: 'center'}}>
            <PixelSprite src="villager_yellow_walk_0.png" w={44} h={72} />
            <div style={{fontSize: 9, color: PX.white, marginTop: 6}}>PETANI</div>
          </div>
          {/* Moving gabah */}
          <div
            style={{
              position: 'absolute',
              left: oldPacketX,
              top: 44,
              background: '#D2A65A',
              border: '2px solid #000',
              padding: '6px 10px',
              fontSize: 9,
              color: '#1E140B',
            }}
          >
            GABAH
          </div>
          {/* Tengkulak */}
          <div
            style={{
              position: 'absolute',
              left: 650,
              top: 26,
              background: '#2E1B18',
              border: `2px solid ${PX.red}`,
              padding: '16px 20px',
              fontSize: 12,
              color: PX.red,
            }}
          >
            TENGKULAK
          </div>
          {/* Tiny coin return */}
          <div style={{position: 'absolute', right: 30, top: 38, textAlign: 'center', opacity: oldU > 0.7 ? 1 : 0.2}}>
            <div
              style={{
                width: 24,
                height: 24,
                margin: '0 auto',
                borderRadius: '50%',
                background: PX.amber,
                border: '3px solid #754E1E',
              }}
            />
            <div style={{fontSize: 9, color: PX.amber, marginTop: 10}}>UNTUNG KECIL</div>
          </div>
        </div>
      </PixelCard>

      {/* Bottom lane: JALUR BARU -> PENGGILINGAN -> JALAN KE KOTA -> WARUNG/PEDAGANG -> Koin besar */}
      <PixelCard x={84} y={372} w={1112} h={254} borderColor={PX.gold} pad="18px 26px">
        <div style={{fontSize: 14, color: PX.gold}}>JALUR BARU: PENGGILINGAN + JALAN DAGANG</div>
        <div style={{position: 'relative', height: 170, marginTop: 14}}>
          <div style={{position: 'absolute', left: 40, right: 140, top: 82, height: 6, background: '#5D4E32'}} />
          {/* Start farmer */}
          <div style={{position: 'absolute', left: 30, top: 36, textAlign: 'center'}}>
            <PixelSprite src="villager_blue_walk_0.png" w={44} h={72} />
            <div style={{fontSize: 9, color: PX.white, marginTop: 6}}>PETANI</div>
          </div>

          {/* Moving commodity */}
          {f >= newStart ? (
            <div
              style={{
                position: 'absolute',
                left: newPacketX,
                top: 56,
                background: newU > 0.45 ? '#FFF8E2' : '#D2A65A',
                border: '2px solid #000',
                padding: '6px 10px',
                fontSize: 9,
                color: '#1E140B',
                zIndex: 3,
              }}
            >
              {newU > 0.45 ? 'BERAS' : 'GABAH'}
            </div>
          ) : null}

          {/* Mill */}
          <div style={{position: 'absolute', left: 320, top: 14, textAlign: 'center'}}>
            <PixelSprite src="mill.png" w={92} h={80} />
            <div style={{fontSize: 9, color: PX.gold, marginTop: 6}}>PENGGILINGAN</div>
          </div>

          {/* Road to city */}
          <div
            style={{
              position: 'absolute',
              left: 510,
              top: 44,
              background: '#2B251B',
              border: `2px solid ${PX.blueLight}`,
              padding: '8px 12px',
              fontSize: 9,
              color: PX.blueLight,
            }}
          >
            JALAN KE KOTA
          </div>

          {/* Market stalls */}
          <div
            style={{
              position: 'absolute',
              left: 724,
              top: 26,
              textAlign: 'center',
              opacity: f >= marketStart ? 1 : 0.35,
            }}
          >
            <div style={{display: 'flex', gap: 8, justifyContent: 'center'}}>
              <PixelSprite src="stall_red.png" w={56} h={45} />
              <PixelSprite src="stall_blue.png" w={56} h={45} />
            </div>
            <div style={{fontSize: 9, color: PX.greenHi, marginTop: 10}}>WARUNG & PEDAGANG</div>
          </div>

          {/* Big gold coin */}
          <div
            style={{
              position: 'absolute',
              right: 22,
              top: 26,
              textAlign: 'center',
              transform: `scale(${f >= DUR - 52 ? coinS : 0.4})`,
              opacity: f >= DUR - 52 ? 1 : 0.2,
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                margin: '0 auto',
                borderRadius: '50%',
                background: PX.gold,
                border: '4px solid #8E6518',
                boxShadow: 'inset 0 4px 0 #FFF6C8',
              }}
            />
            <div style={{fontSize: 10, color: PX.gold, marginTop: 10}}>UNTUNG BESAR</div>
          </div>
        </div>
      </PixelCard>
    </AbsoluteFill>
  );
};
