import { Descendant } from 'slate';
import { TranscriptWord } from 'types/slate';
import { getWordsForParagraph } from '../get-words-for-paragraph';
import { shortTimecode } from '../timecode-converter';

function generateText(paragraph: TranscriptParagraph, words: TranscriptWord[]): string {
  return words
    .filter((word) => word.start >= paragraph.start && word.end <= paragraph.end)
    .map((w) => w.text)
    .join(' ');
}

export interface TranscriptData {
  words?: TranscriptWord[];
  paragraphs?: TranscriptParagraph[];
}

export interface TranscriptParagraph {
  id: number;
  start: number;
  end: number;
  speaker: string;
}

export function convertDpeToSlate(transcript: TranscriptData): Descendant[] {
  const { words, paragraphs } = transcript;
  if (!words || !paragraphs) {
    return [
      {
        speaker: 'U_UKN',
        start: 0,
        startTimecode: '00:00:00',
        type: 'timedText',
        children: [
          {
            text: 'Text',
            // Adding list of words in slateJs paragraphs
            words: [],
          },
        ],
      },
    ];
  }

  return paragraphs.map((paragraph, index) => ({
    speaker: paragraph.speaker,
    start: paragraph.start,
    index,
    // pre-computing the display of the formatting here so that it doesn't need to convert it in leaf render
    startTimecode: shortTimecode(paragraph.start),
    type: 'timedText',
    children: [
      {
        text: generateText(paragraph, words),
        // Adding list of words in slateJs paragraphs
        words: getWordsForParagraph(paragraph, words),
      },
    ],
  }));
}
