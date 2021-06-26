/**
 * Raised in this comment https://github.com/bbc/react-transcript-editor/pull/9
 * abstracted from https://github.com/bbc/newslabs-cdn/blob/master/js/20-bbcnpf.utils.js
 * In broadcast VIDEO, timecode is NOT hh:mm:ss:ms, it's hh:mm:ss:ff where ff is frames,
 * dependent on the framerate of the media concerned.
 * `hh:mm:ss:ff`
 */

/**
 * Helper function
 * Rounds to the 14milliseconds boundaries
 * Time in video can only "exist in" 14milliseconds boundaries.
 * This makes it possible for the HTML5 player to be frame accurate.
 * @param {*} seconds
 * @param {*} fps
 */
const normalisePlayerTime = function (seconds: number, fps: number): number {
  return Number(((1.0 / fps) * Math.floor(Number((fps * seconds).toPrecision(12)))).toFixed(2));
};

/**
 * Convert a time in seconds to a timestamp in the `hh:mm:ss:ff` format.
 * @param seconds
 * @param fps Frames per second
 */
export function secondsToTimecode(seconds: number, fps = 25): string {
  // handle edge case, trying to convert zero seconds
  if (seconds === 0) {
    return '00:00:00:00';
  }

  const normalisedSeconds = normalisePlayerTime(seconds, fps);
  const wholeSeconds = Math.floor(normalisedSeconds);
  const frames = Math.round((normalisedSeconds - wholeSeconds) * fps);

  // prepends zero - example pads 3 to 03
  function padZero(n: number) {
    if (n < 10) return `0${Math.floor(n)}`;

    return Math.floor(n);
  }

  return `${padZero((wholeSeconds / 60 / 60) % 60)}:${padZero((wholeSeconds / 60) % 60)}:${padZero(wholeSeconds % 60)}:${padZero(frames)}`;
}

export default secondsToTimecode;
