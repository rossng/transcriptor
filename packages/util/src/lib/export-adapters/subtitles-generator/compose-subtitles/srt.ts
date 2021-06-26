import { formatSeconds } from './util/format-seconds';

export function srtGenerator(vttJSON: { start: number; end: number; speaker: string; text: string }[]): string {
  let srtOut = '';
  vttJSON.forEach((v: any, i: number) => {
    srtOut += `${i + 1}\n${formatSeconds(parseFloat(v.start)).replace('.', ',')} --> ${formatSeconds(parseFloat(v.end)).replace(
      '.',
      ','
    )}\n${v.text.trim()}\n\n`;
  });

  return srtOut;
}
