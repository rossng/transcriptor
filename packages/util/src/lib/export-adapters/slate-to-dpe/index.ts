/**
 * converted from react-transcript-editor draftJS update timestamp helper function
 * https://github.com/pietrop/react-transcript-editor/blob/master/packages/components/timed-text-editor/UpdateTimestamps/index.js
 * similar to "update Timestamps" function
 */
import assert from 'assert';
import * as R from 'ramda';
import { Descendant } from 'slate';
import { TranscriptWord } from 'types/slate';
import { countWords } from '../../count-words';

/**
 * Transposes the timecodes from stt json list of words onto
 * dpe transcript with paragraphs and words
 */
export function createDpeParagraphsFromSlateJs(
  currentContent: Descendant[],
  newEntities: TranscriptWord[]
): { speaker: string; start: number; end: number }[] {
  // Update entities to block structure.
  let totalWords = 0;
  return currentContent.map((block) => {
    assert('children' in block);

    const text = block.children[0].text;
    const wordsInBlock = countWords(text);
    const blockEntities = newEntities.slice(totalWords, totalWords + wordsInBlock);
    let speaker = block.speaker;
    const start = blockEntities[0].start;
    const end = blockEntities[blockEntities.length - 1].end;
    if (!speaker) {
      speaker = 'U_UKN';
    }
    const updatedBlock = {
      speaker: speaker,
      start,
      end,
    };

    totalWords += wordsInBlock;
    return updatedBlock;
  });
}

// slateParagraphs with words attributes ToDpeWords
function slateParagraphsToDpeWords(slateParagraphs: Descendant[]): TranscriptWord[] {
  return R.flatten(
    slateParagraphs.map((block) => {
      return 'children' in block ? block.children[0].words : [];
    })
  );
}
/**
 * Update timestamps using stt-align module
 * @param {*} currentContent - slate js value
 * @return dpe transcript with paragraphs and words
 */
export function convertSlateToDpe(currentContent: Descendant[]): {
  words: TranscriptWord[];
  paragraphs: { speaker: string; start: number; end: number }[];
} {
  // using updateBlocksTimestamps instead of previous way to align
  // this should be more computationally efficient for now as it only adjust paragraphs that have changed
  // keeps source of truth in the blocks as opposed to compare to the dpe transcript
  // const alignedSlateParagraphs = updateBlocksTimestamps(currentContent);
  // const alignedWords = slateParagraphsToDpeWords(alignedSlateParagraphs);
  // assumes that words are already aligned and this is just doing a conversion between formats
  // the parent component handles keeping the words in sync
  const alignedWords = slateParagraphsToDpeWords(currentContent);
  const updatedContent = createDpeParagraphsFromSlateJs(currentContent, alignedWords);
  return { words: alignedWords, paragraphs: updatedContent };
}
