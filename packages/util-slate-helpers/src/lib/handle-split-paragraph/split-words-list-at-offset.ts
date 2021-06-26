import * as R from 'ramda';
import { TranscriptWord } from '../../types/slate';

/**
 *
 * @param {number} offset - offset char number position/index
 */
function splitWordsListAtOffset(words: TranscriptWord[], offset: number): [TranscriptWord[], TranscriptWord[]] {
  const tmpWords = R.clone(words);
  const wordsAfter = tmpWords.splice(offset);
  const wordsBefore = tmpWords;
  return [wordsBefore, wordsAfter];
}

export default splitWordsListAtOffset;
