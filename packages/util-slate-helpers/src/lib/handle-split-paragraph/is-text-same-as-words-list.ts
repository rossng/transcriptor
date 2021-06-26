/**
 * Helper function to tell if caret/cursor is in the middle of a word
 * helper function for handle split paragraph
 * @param textBefore - string text
 * @param wordsBefore  - list of words object
 */

import { TranscriptWord } from 'types/slate';

export function isTextSameAsWordsList(textBefore: string, wordsBefore: TranscriptWord[]): boolean {
  // convert them to the same format, for comparison
  // convert the text list string to an array strings (words text)
  const textBeforeList = textBefore.trim().replace(/\s\s+/g, ' ').split(' ');
  // convert the array of words object, to an array of strings (words text)
  const wordsBeforeList = wordsBefore.map((w) => {
    return w.text;
  });
  // get last word from text list
  const lastTextWord = textBeforeList[textBeforeList.length - 1];
  // get last word from word list
  const lastWord = wordsBeforeList[wordsBeforeList.length - 1];
  // if they are not the same then the cursor is in the middle of a word
  // because `lastTextWord` would be chopped

  const result = !(lastTextWord.trim() === lastWord.trim());

  return result;
}
