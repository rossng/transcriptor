import { TranscriptWord } from 'types/slate';
import { TranscriptParagraph } from '../../util/dpe-to-slate';
import { Word } from '../../util/export-adapters/subtitles-generator/presegment-text';

/**
 *
 * @param currentParagraph a dpe paragraph object, with start, and end attribute eg in seconds
 * @param words a list of word objects with start and end attributes
 * @returns a list of words objects that are included in the given paragraphs
 */
export function getWordsForParagraph(currentParagraph: TranscriptParagraph, words: TranscriptWord[]): Word[] {
  const { start, end } = currentParagraph;
  return words.filter((word) => {
    return word.start >= start && word.end <= end;
  });
}
