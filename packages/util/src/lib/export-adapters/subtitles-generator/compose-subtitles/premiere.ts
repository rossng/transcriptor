import { escapeText } from './util/escape-text';
import { formatSeconds } from './util/format-seconds';

export function ttmlGeneratorPremiere(vttJSON: { start: number; end: number; speaker: string; text: string }[]): string {
  let ttmlOut = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
    <tt xmlns="http://www.w3.org/ns/ttml"
    xmlns:ttp="http://www.w3.org/ns/ttml#parameter"
    ttp:timeBase="media"
    xmlns:m608="http://www.smpte-ra.org/schemas/2052-1/2010/smpte-tt#cea608"
    xmlns:smpte="http://www.smpte-ra.org/schemas/2052-1/2010/smpte-tt"
    xmlns:ttm="http://www.w3.org/ns/ttml#metadata">
    <head>
    <metadata>
    <smpte:information m608:captionService="F1C1CC" m608:channel="cc1"/>
    </metadata>
    <styling></styling>
    <layout></layout>
    </head>
    <body><div>`;

  vttJSON.forEach((v: any) => {
    ttmlOut += `<p begin="${formatSeconds(parseFloat(v.start))}" end="${formatSeconds(parseFloat(v.end))}">${escapeText(v.text).replace(
      /\n/g,
      '<br />'
    )}</p>\n`;
  });
  ttmlOut += '</div>\n</body>\n</tt>';

  return `${ttmlOut}`;
}
