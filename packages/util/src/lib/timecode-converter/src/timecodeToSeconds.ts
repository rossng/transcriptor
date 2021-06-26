function timecodeToFrames(tc: string, fps: number): number {
  // TODO make 29.97 fps drop-frame aware - works for 25 only.

  const s = tc.split(':');
  let frames = parseInt(s[3]);
  frames += parseInt(s[2]) * fps;
  frames += parseInt(s[1]) * (fps * 60);
  frames += parseInt(s[0]) * (fps * 60 * 60);

  return frames;
}

/**
 * Convert broadcast timecodes to seconds
 * @param timecode - `hh:mm:ss:ff`
 * @param framePerSeconds - defaults to 25 if not provided
 */
export function timecodeToSecondsHelper(timecode: string, framePerSeconds = 25): number {
  const frames = timecodeToFrames(timecode, framePerSeconds);
  return Number(Number(frames / framePerSeconds).toFixed(2));
}
