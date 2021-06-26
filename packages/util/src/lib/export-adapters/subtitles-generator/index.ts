import assert from 'assert';
import { Descendant } from 'slate';
import { TranscriptWord } from 'types/slate';
import { CaptionType } from '..';
import { countWords } from '../../count-words';
import { TranscriptParagraph } from '../../dpe-to-slate';
import { csvGenerator } from './compose-subtitles/csv';
import { ittGenerator } from './compose-subtitles/itt';
import { ttmlGeneratorPremiere } from './compose-subtitles/premiere';
import { srtGenerator } from './compose-subtitles/srt';
import { ttmlGenerator } from './compose-subtitles/ttml';
import { formatSeconds } from './compose-subtitles/util/format-seconds';
import { vttGenerator } from './compose-subtitles/vtt';
import { getTextFromWordsList, preSegmentText } from './presegment-text';
import { divideIntoTwoLines } from './presegment-text/divide-into-two-lines';
import { foldWords } from './presegment-text/fold';
import { addLineBreakBetweenSentences } from './presegment-text/line-break-between-sentences';
import { textSegmentation } from './presegment-text/text-segmentation';

function segmentedTextToList(text: string): string[] {
  let result = text.split('\n\n');
  result = result.map((line) => {
    return line.trim();
  });

  return result;
}

function addTimecodesToLines(wordsList: TranscriptWord[], paragraphs: Omit<TranscriptParagraph, 'id'>[], lines: string[]) {
  wordsList = wordsList.filter((w) => w.text.length > 0);
  let startWordCounter = 0;
  let endWordCounter = 0;
  console.log('lines', lines);
  const results = lines
    .filter((l) => {
      return l;
    })
    .map((line) => {
      endWordCounter += countWords(line);
      const jsonLine = {
        text: line.trim(),
        start: wordsList[startWordCounter].start,
        end: wordsList[endWordCounter - 1].end,
      };
      // #-----------------|------|-----------------#
      const possibleParagraphs = paragraphs
        .filter((p) => jsonLine.start >= p.start && jsonLine.start < p.end)
        .map((p) => {
          const inParagraphEndTime = Math.min(jsonLine.end, p.end);
          const inParagraphDuration = inParagraphEndTime - jsonLine.start;

          const totalDuration = jsonLine.end - jsonLine.start;
          const pctInParagraph = inParagraphDuration / totalDuration;

          return {
            ...p,
            pctInParagraph,
          };
        })
        .sort((a, b) => b.pctInParagraph - a.pctInParagraph || a.start - b.start); // sort by % in paragraph descending, then start time ascending

      startWordCounter = endWordCounter;

      return { ...jsonLine, speaker: possibleParagraphs.length > 0 ? possibleParagraphs[0].speaker : 'UNKNOWN' };
    });

  return results;
}

function convertSlateValueToSubtitleJson(slateValue: Descendant[]): { start: number; end: number; speaker: string; text: string }[] {
  // there shouldn't be empty blocks in the slateJs content value
  // but adding a filter here to double check just in cases
  return slateValue
    .filter((block) => {
      return block;
    })
    .map((block) => {
      assert('type' in block && block.type === 'timedText');
      return {
        start: block.start,
        end: block.children[0].words[block.children[0].words.length - 1].end,
        speaker: block.speaker,
        text: block.children[0].text,
      };
    });
}

function preSegmentTextJson({
  wordsList,
  paragraphs,
  numberOfCharPerLine,
}: {
  wordsList: TranscriptWord[];
  paragraphs: Omit<TranscriptParagraph, 'id'>[];
  numberOfCharPerLine?: number;
}) {
  const result = preSegmentText(wordsList, numberOfCharPerLine);
  const segmentedTextArray = segmentedTextToList(result);
  return addTimecodesToLines(wordsList, paragraphs, segmentedTextArray);
}

export function subtitlesComposer({
  words,
  paragraphs,
  type,
  numberOfCharPerLine,
  slateValue,
}: {
  words: TranscriptWord[];
  paragraphs: Omit<TranscriptParagraph, 'id'>[];
  type: CaptionType;
  numberOfCharPerLine?: number;
  slateValue: Descendant[];
}): any {
  const subtitlesJson =
    type === 'vtt_speakers_paragraphs'
      ? convertSlateValueToSubtitleJson(slateValue)
      : preSegmentTextJson({
          wordsList: words,
          paragraphs,
          numberOfCharPerLine,
        });

  console.log('subtitlesJson', subtitlesJson);

  if (typeof words === 'string') {
    return preSegmentText(words, numberOfCharPerLine);
  }
  switch (type) {
    case 'premiereTTML':
      return ttmlGeneratorPremiere(subtitlesJson);
    case 'ttml':
      return ttmlGenerator(subtitlesJson);
    case 'itt':
      return ittGenerator(subtitlesJson);
    case 'srt':
      return srtGenerator(subtitlesJson);
    case 'vtt':
      return vttGenerator(subtitlesJson);
    case 'vtt_speakers':
      return vttGenerator(subtitlesJson, true);
    case 'vtt_speakers_paragraphs':
      return vttGenerator(subtitlesJson, true);
    case 'json':
      // converting timecodes to captions time stamps
      return subtitlesJson.map((line) => {
        return {
          ...line,
          start: formatSeconds(line.start).replace('.', ','),
          end: formatSeconds(line.end).replace('.', ','),
        };
      });
    case 'csv':
      return csvGenerator(subtitlesJson);
    case 'pre-segment-txt':
      return preSegmentText(words, numberOfCharPerLine);
    case 'txt':
      return preSegmentText(words, numberOfCharPerLine);
    default:
      return 'Could not find the subtitle format';
  }
}

export {
  textSegmentation,
  addLineBreakBetweenSentences,
  foldWords,
  divideIntoTwoLines,
  getTextFromWordsList,
  preSegmentText,
  ttmlGeneratorPremiere,
  ttmlGenerator,
  ittGenerator,
  srtGenerator,
  vttGenerator,
};
