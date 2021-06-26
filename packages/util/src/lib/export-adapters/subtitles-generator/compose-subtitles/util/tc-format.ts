// for itt
import TC from 'smpte-timecode';

export function tcFormat(frames: number, FPS: TC.FRAMERATE): string {
  const tc = TC(Math.round(frames), FPS, false);

  return tc.toString().replace(/^00/, '01'); // FIXME this breaks on videos longer than 1h!
}
