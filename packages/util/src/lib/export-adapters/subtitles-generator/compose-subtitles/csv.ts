import { formatSeconds } from './util/format-seconds';

export function csvGenerator(srtJsonContent: { start: number; end: number; speaker: string; text: string }[]): string {
  let lines = 'N, In, Out, Text\n';
  srtJsonContent.forEach((srtLineO: any, index: number) => {
    lines += `${index + 1},`;
    //need to surround timecodes with "\"" escaped " to escape the , for the milliseconds
    // lines += `\"${ srtLineO.start }\",\"${ srtLineO.end }\",`;
    lines += `"${formatSeconds(parseFloat(srtLineO.start)).replace('.', ',')}","${formatSeconds(parseFloat(srtLineO.end)).replace('.', ',')}",`;
    // removing line breaks and and removing " as they break the csv.
    // wrapping text in escaped " to  escape any , for the csv.
    // adding carriage return \n to signal end of line in csv
    // Preserving line break within srt lines to allow round trip from csv back to srt file in same format.
    // by replacing \n with \r\n.
    lines += `"${srtLineO.text.replace(/\n/g, '\r\n')}"\n`;
  });

  return lines;
}
