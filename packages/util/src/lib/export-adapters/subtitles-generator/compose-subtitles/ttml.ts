import { escapeText } from './util/escape-text';
import { formatSeconds } from './util/format-seconds';

export function ttmlGenerator(vttJSON: { start: number; end: number; speaker: string; text: string }[]): string {
  let ttmlOut = `<?xml version="1.0" encoding="UTF-8"?>
    <tt xmlns="http://www.w3.org/ns/ttml">
    <head></head>
    <body>
    <div>`;
  vttJSON.forEach((v: any) => {
    ttmlOut += `<p begin="${formatSeconds(parseFloat(v.start))}" end="${formatSeconds(parseFloat(v.end))}">${escapeText(v.text).replace(
      /\n/g,
      '<br />'
    )}</p>\n`;
  });
  ttmlOut += '</div>\n</body>\n</tt>';

  return ttmlOut;
}
