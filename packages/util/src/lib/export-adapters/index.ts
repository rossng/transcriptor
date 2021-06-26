/**
 * Adapters for Draft.js conversion
 * @param {json} slateValue - Draft.js blocks
 * @param {string} type - the type of file supported by the available adapters
 */

// Note: export adapter does not do any alignment
// just converts between formats
import { Descendant } from 'slate';
import { slateToDocx } from './docx';
import { convertSlateToDpe } from './slate-to-dpe';
import { subtitlesComposer } from './subtitles-generator/index';
import { subtitlesExportOptionsList } from './subtitles-generator/list';
import { slateToText } from './txt';

export type ExportData = {
  type: string;
  ext?: any;
  speakers?: boolean;
  timecodes?: boolean;
  inlineTimecodes?: boolean;
  hideTitle?: any;
  atlasFormat?: boolean;
  isDownload?: boolean;
  slateValue?: any;
  transcriptTitle?: any;
};

const captionTypeList = subtitlesExportOptionsList.map((list) => {
  return list.type;
});

export type CaptionType =
  | 'vtt_speakers_paragraphs'
  | 'premiereTTML'
  | 'ttml'
  | 'itt'
  | 'srt'
  | 'vtt'
  | 'vtt_speakers'
  | 'json'
  | 'csv'
  | 'pre-segment-txt'
  | 'txt';

export function isCaptionType(value: string): value is CaptionType {
  return captionTypeList.includes(value);
}

export function exportAdapter({
  slateValue,
  type,
  transcriptTitle,
  speakers,
  timecodes,
  inlineTimecodes,
  hideTitle,
  atlasFormat,
}: {
  slateValue: Descendant[];
  type: string;
  transcriptTitle: string;
  speakers: any;
  timecodes: any;
  inlineTimecodes: any;
  hideTitle: any;
  atlasFormat: boolean;
}): any {
  switch (type) {
    case 'text':
      return slateToText({ value: slateValue, speakers, timecodes, atlasFormat });
    case 'json-slate':
      return slateValue;
    case 'json-digitalpaperedit':
      return convertSlateToDpe(slateValue);
    case 'word':
      //   return { data: draftToDocx(slateValue, transcriptTitle), ext: 'docx' };
      return slateToDocx({
        title: transcriptTitle,
        value: slateValue,
        speakers,
        timecodes,
        inlineTimecodes,
        hideTitle,
      });
    default:
      if (isCaptionType(type)) {
        const editorContent = convertSlateToDpe(slateValue);
        const subtitlesJson = subtitlesComposer({
          words: editorContent.words,
          paragraphs: editorContent.paragraphs,
          type,
          slateValue,
        });
        return subtitlesJson;
      }
      // some default, unlikely to be called
      console.error('Did not recognise the export format ', type);
      return 'Did not recognise the export format';
  }
}
