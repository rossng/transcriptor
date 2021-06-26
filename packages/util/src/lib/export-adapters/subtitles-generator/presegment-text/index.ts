import { divideIntoTwoLines } from './divide-into-two-lines';
import { foldWords } from './fold';
import { addLineBreakBetweenSentences } from './line-break-between-sentences';
import { textSegmentation } from './text-segmentation';

export interface Word {
  id: number;
  start: number;
  end: number;
  text: string;
}

/**
 * Takes in array of word object,
 *  and returns string containing all the text
 * @param {array} words - Words
 */
function getTextFromWordsList(words: Word[]): string {
  return words
    .map((word) => {
      return word.text;
    })
    .join(' ');
}

/**
 *
 * @param {*} textInput - can be either plain text string or an array of word objects
 */
function preSegmentText(textInput: string | Word[], tmpNumberOfCharPerLine = 35): string {
  const text: string = typeof textInput === 'string' ? textInput : getTextFromWordsList(textInput);
  const segmentedText = textSegmentation(text);
  // - 2.Line break between sentences
  const textWithLineBreakBetweenSentences = addLineBreakBetweenSentences(segmentedText);
  // - 3.Fold char limit per line
  const foldedText = foldWords(textWithLineBreakBetweenSentences, tmpNumberOfCharPerLine);
  // - 4.Divide into two lines
  const textDividedIntoTwoLines = divideIntoTwoLines(foldedText);

  return textDividedIntoTwoLines;
}

export { preSegmentText, getTextFromWordsList };
