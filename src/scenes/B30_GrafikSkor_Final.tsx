import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {fullLocalF} from '../fullPlan';
import {PX, PixelCard, PixelChip, PixelSprite, PixelStamp} from '../components/PixelUI';
import {LiveMapBg} from '../components/LiveMapBg';

const DUR = 901; // 545.74 - 575.76s

const CHECK_PTS: Array<[number, number, number]> = [
  [0, 20, 20],
  [2, 28, 34],
  [4, 46, 40],
  [6, 60, 44],
  [10, 74, 38],
  [14, 80, 46],
  [20, 88, 56],
];

const BOX = {x0: 150, y0: 150, x1: 1120, y1: 560};
const toX = (yr: number) => BOX.x0 + (BOX.x1 - BOX.x0) * (yr / 20);
const toY = (val: number) => BOX.y1 - (BOX.y1 - BOX.y0) * (val / 100);

export const B30_GrafikSkor_Final: React.FC = () => {
  const f = useCurrentFrame();

  const chartStart = fullLocalF('B30', 548.96);
  const chartEnd = fullLocalF('B30', 566.96);
  const stampAt = fullLocalF('B30', 562.0);
  const mulyadiVerdictAt = fullLocalF('B30', 563.76);

  if (f < chartStart) {
    return (
      <AbsoluteFill>
        <LiveMapBg era="y16" zoomFrom={1.0} zoomTo={1.06} dim={0.15} dur={chartStart} />
        <PixelChip
          text="TAHUN 20 • AKHIR SIMULASI"
          x={640}
          y={76}
          centerX
          borderColor={PX.gold}
          fontSize={14}
        />
      </AbsoluteFill>
    );
  }

  if (f >= chartEnd) {
    // Summary contrast card 88 vs 56
    return (
      <Sequence from={chartEnd} durationInFrames={DUR - chartEnd}>
        <AbsoluteFill>
          <LiveMapBg era="y16" zoomFrom={1.04} zoomTo={1.08} dim={0.45} dur={DUR - chartEnd} />
          <PixelCard x={120} y={134} w={490} h={450} borderColor={PX.gold} pad="24px 26px">
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <PixelSprite src="portrait_kevin_happy.png" w={72} h={148} />
              <div>
                <div style={{fontSize: 18, color: PX.gold}}>KEVIN MENANG</div>
                <div style={{fontSize: 28, color: PX.white, marginTop: 14}}>88</div>
              </div>
            </div>
            <div style={{marginTop: 28, fontSize: 12, color: PX.greenHi, lineHeight: 1.9}}>
              <div>&gt; VISIONER</div>
              <div>&gt; MAU MENDENGAR</div>
              <div>&gt; BELAJAR DARI KESALAHAN</div>
            </div>
          </PixelCard>

          <PixelCard x={670} y={134} w={490} h={450} borderColor={PX.red} pad="24px 26px">
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <PixelSprite src="portrait_mulyadi_sad.png" w={72} h={148} />
              <div>
                <div style={{fontSize: 18, color: PX.red}}>MULYADI KALAH</div>
                <div style={{fontSize: 28, color: PX.white, marginTop: 14}}>56</div>
              </div>
            </div>
            <div
              style={{
                marginTop: 28,
                fontSize: 12,
                color: '#FFD2CA',
                lineHeight: 1.9,
                opacity: f >= mulyadiVerdictAt ? 1 : 0.35,
              }}
            >
              <div>X KERAS KEPALA</div>
              <div>X ANTI KRITIK</div>
              <div>X MENOLAK BELAJAR</div>
            </div>
          </PixelCard>
        </AbsoluteFill>
      </Sequence>
    );
  }

  // Full-screen animated score chart (548.96 - 566.96)
  const p = interpolate(f, [chartStart, chartEnd - 54], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const curYr = 20 * p;

  const ptsS: Array<[number, number]> = [];
  const ptsT: Array<[number, number]> = [];
  const passed: Array<[number, number, number]> = [];

  for (let i = 0; i < CHECK_PTS.length; i++) {
    const [yr, sv, tv] = CHECK_PTS[i];
    if (yr <= curYr + 1e-4) {
      ptsS.push([toX(yr), toY(sv)]);
      ptsT.push([toX(yr), toY(tv)]);
      passed.push([yr, sv, tv]);
    } else {
      const [pyr, ps, pt] = CHECK_PTS[i - 1];
      const frac = (curYr - pyr) / Math.max(1e-4, yr - pyr);
      ptsS.push([toX(curYr), toY(ps + (sv - ps) * frac)]);
      ptsT.push([toX(curYr), toY(pt + (tv - pt) * frac)]);
      break;
    }
  }

  return (
    <AbsoluteFill style={{backgroundColor: '#14161E'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 72,
          translate: '-50% 0',
          fontSize: 20,
          color: PX.gold,
          whiteSpace: 'nowrap',
        }}
      >
        GRAFIK INDEKS KEMAKMURAN (TH 0 - 20)
      </div>

      {/* Legend */}
      <div style={{position: 'absolute', left: 370, top: 112, display: 'flex', gap: 48, fontSize: 12}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, color: PX.gold}}>
          <div style={{width: 22, height: 12, background: PX.gold}} />
          SINARBARU
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, color: PX.green}}>
          <div style={{width: 22, height: 12, background: PX.green}} />
          TANJUNGSARI
        </div>
      </div>

      <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 20, 40, 60, 80, 100].map((sc) => {
          const yy = toY(sc);
          return (
            <g key={sc}>
              <line x1={BOX.x0} y1={yy} x2={BOX.x1} y2={yy} stroke="#2B3042" strokeWidth={2} />
              <text x={BOX.x0 - 16} y={yy + 5} textAnchor="end" fill="#9AA2BA" fontSize={11} fontFamily="Press Start 2P">
                {sc}
              </text>
            </g>
          );
        })}

        {[0, 2, 4, 6, 10, 14, 20].map((yr) => {
          const xx = toX(yr);
          return (
            <g key={yr}>
              <line x1={xx} y1={BOX.y0} x2={xx} y2={BOX.y1} stroke="#2B3042" strokeWidth={2} />
              <text x={xx} y={BOX.y1 + 26} textAnchor="middle" fill="#9AA2BA" fontSize={11} fontFamily="Press Start 2P">
                TH {yr}
              </text>
            </g>
          );
        })}

        <polyline
          points={`${BOX.x0},${BOX.y0} ${BOX.x0},${BOX.y1} ${BOX.x1},${BOX.y1}`}
          fill="none"
          stroke="#D0D6E8"
          strokeWidth={3}
        />

        {ptsS.length >= 2 ? (
          <polyline
            points={ptsS.map((pt) => pt.join(',')).join(' ')}
            fill="none"
            stroke={PX.gold}
            strokeWidth={6}
          />
        ) : null}
        {ptsT.length >= 2 ? (
          <polyline
            points={ptsT.map((pt) => pt.join(',')).join(' ')}
            fill="none"
            stroke={PX.green}
            strokeWidth={6}
          />
        ) : null}

        {passed.map(([yr, sv, tv]) => {
          const sx = toX(yr);
          const sy = toY(sv);
          const ty = toY(tv);
          return (
            <g key={yr}>
              <circle cx={sx} cy={sy} r={7} fill={PX.gold} stroke="#141210" strokeWidth={2} />
              <circle cx={sx} cy={ty} r={7} fill={PX.green} stroke="#141210" strokeWidth={2} />
              {yr > 0 ? (
                <>
                  <text
                    x={sx}
                    y={sv >= tv ? sy - 14 : sy + 24}
                    textAnchor="middle"
                    fill={PX.gold}
                    fontSize={12}
                    fontFamily="Press Start 2P"
                  >
                    {sv}
                  </text>
                  <text
                    x={sx}
                    y={sv >= tv ? ty + 24 : ty - 14}
                    textAnchor="middle"
                    fill={PX.green}
                    fontSize={12}
                    fontFamily="Press Start 2P"
                  >
                    {tv}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}
      </svg>

      {f >= stampAt ? (
        <PixelStamp
          text="SINARBARU MENANG • 88 vs 56"
          x={820}
          y={496}
          at={stampAt}
          color={PX.gold}
          rot={-2}
          fontSize={18}
        />
      ) : null}
    </AbsoluteFill>
  );
};
