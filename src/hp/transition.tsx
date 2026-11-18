import React from 'react';
import {AbsoluteFill, Freeze, Sequence} from 'remotion';
import {
  linearTiming,
  TransitionSeries,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from '@remotion/transitions';
import {W, H} from '../lib/tokens';
import {PX} from '../components/PixelUI';

type EmptyProps = Record<string, never>;

const COLS = 16;
const COL_W = W / COLS; // 80px crisp pixel column

/**
 * Single unified transition language across the entire video (Pagar 12):
 * Stepped Pixel Block Wipe (wipe blok piksel) — zero blur, snapped to pixel grid.
 */
const PixelBlockWipeComponent: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  if (presentationDirection === 'exiting') {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // Incoming scene reveals via stepped 80px pixel shutter columns sweeping left-to-right
  const totalSteps = COLS + 3;
  const stepIdx = Math.floor(presentationProgress * totalSteps);
  const revealedCols = Math.min(COLS, Math.max(0, stepIdx));
  const revealX = revealedCols * COL_W;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `polygon(0px 0px, ${revealX}px 0px, ${revealX}px ${H}px, 0px ${H}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
      {revealX > 0 && revealX < W ? (
        <div
          style={{
            position: 'absolute',
            left: revealX - 8,
            top: 0,
            width: 8,
            height: H,
            background: PX.gold,
            borderLeft: '2px solid #141210',
            borderRight: '2px solid #141210',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const pixelBlockPresentation = (): TransitionPresentation<EmptyProps> => ({
  component: PixelBlockWipeComponent,
  props: {},
});

const AlignedLead: React.FC<{lead: number; children: React.ReactNode}> = ({lead, children}) =>
  lead <= 0 ? (
    <>{children}</>
  ) : (
    <>
      <Sequence layout="none" durationInFrames={lead}>
        <Freeze frame={0}>{children}</Freeze>
      </Sequence>
      <Sequence layout="none" from={lead}>
        {children}
      </Sequence>
    </>
  );

export interface HpCutScene {
  id: string;
  component: React.ComponentType;
  durationInFrames: number;
  wipeIn?: boolean;
}

const WIPE_FRAMES = 8;

export const PixelWipeSeries: React.FC<{scenes: HpCutScene[]}> = ({scenes}) => {
  const T = scenes.map((s, i) => (i === 0 || s.wipeIn === false ? 0 : WIPE_FRAMES));
  const lead = T.map((t) => (t > 0 ? Math.round(t / 2) : 0));

  const kids: React.ReactElement[] = [];
  scenes.forEach((s, i) => {
    if (T[i] > 0) {
      kids.push(
        <TransitionSeries.Transition
          key={`tr-${s.id}`}
          timing={linearTiming({durationInFrames: T[i]})}
          presentation={pixelBlockPresentation()}
        />,
      );
    }
    const tail = i + 1 < scenes.length && T[i + 1] > 0 ? T[i + 1] - lead[i + 1] : 0;
    const SceneComp = s.component;
    kids.push(
      <TransitionSeries.Sequence
        key={s.id}
        name={s.id}
        durationInFrames={lead[i] + s.durationInFrames + tail}
      >
        <AlignedLead lead={lead[i]}>
          <SceneComp />
        </AlignedLead>
      </TransitionSeries.Sequence>,
    );
  });

  return (
    <AbsoluteFill style={{isolation: 'isolate'}}>
      <TransitionSeries>{kids}</TransitionSeries>
    </AbsoluteFill>
  );
};
