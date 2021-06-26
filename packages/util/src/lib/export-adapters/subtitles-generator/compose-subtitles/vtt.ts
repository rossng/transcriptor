import { formatSeconds } from './util/format-seconds';

export function vttGenerator(vttJSON: { start: number; end: number; speaker: string; text: string }[], speakers = false): string {
  let vttOut = 'WEBVTT\n\n';
  vttJSON.forEach((v: any, i: number) => {
    vttOut += `${i + 1}\n${formatSeconds(parseFloat(v.start))} --> ${formatSeconds(parseFloat(v.end))}\n${speakers ? `<v ${v.speaker}>` : ''}${
      v.text
    }\n\n`;
  });

  return vttOut;
}
