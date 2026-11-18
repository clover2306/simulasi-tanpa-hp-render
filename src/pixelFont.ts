import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

export const PIXEL_FONT = "'Press Start 2P', monospace";

let pixelLoaded = false;
const handle = delayRender('Loading Press Start 2P pixel font');

export const pixelFontReady: Promise<void> = (async () => {
  try {
    const face = new FontFace(
      'Press Start 2P',
      `url(${staticFile('fonts/PressStart2P-Regular.ttf')}) format('truetype')`,
      {weight: '400', style: 'normal', display: 'block'},
    );
    document.fonts.add(await face.load());
    pixelLoaded = true;
    continueRender(handle);
  } catch (err) {
    cancelRender(err);
  }
})();

export const isPixelFontLoaded = () => pixelLoaded;
