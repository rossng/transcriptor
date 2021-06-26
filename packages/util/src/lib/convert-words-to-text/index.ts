import { TranscriptWord } from 'types/slate';

/**
 * Helper function
 * @param {array} words - dpe word object, with at list text attribute to be able to convert to string of text
 */
export function convertWordsToText(words: TranscriptWord[]): string {
  return words
    .map((word) => {
      return word.text ? word.text.trim() : '';
    })
    .join(' ');
}
