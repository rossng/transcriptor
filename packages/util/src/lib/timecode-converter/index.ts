/**
 * Wrapping around "time stamps" and timecode conversion modules
 * To provide more support for variety of formats.
 */
import { padTimeToTimecode } from './src/padTimeToTimecode';
import { secondsToTimecode } from './src/secondsToTimecode';
import { timecodeToSecondsHelper } from './src/timecodeToSeconds';

/**
 * @param time
 * Can take as input timecodes in the following formats
 * - hh:mm:ss:ff
 * - mm:ss
 * - m:ss
 * - ss - seconds --> if it's already in seconds then it just returns seconds
 * - hh:mm:ff
 * @todo could be refactored with some helper functions for clarity
 */
function timecodeToSeconds(time: string): number {
  if (typeof time === 'string') {
    const resultPadded = padTimeToTimecode(time);
    const resultConverted = timecodeToSecondsHelper(resultPadded.toString());

    return resultConverted;
  }

  // assuming it receive timecode as seconds as string '600'
  return parseFloat(time);
}

function shortTimecode(time: number): string {
  // handle edge case if it's zero, then just return shorter timecode
  if (time === 0) {
    return '00:00:00';
  } else {
    const timecode = secondsToTimecode(time);
    return timecode.slice(0, -3);
  }
}

export { secondsToTimecode, timecodeToSeconds, shortTimecode };
