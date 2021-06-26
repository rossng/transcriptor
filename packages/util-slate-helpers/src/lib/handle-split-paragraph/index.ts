/**
 * handles splitting a paragraph, as well as associated block paragraph data
 * such as word timecodes, previous times,
 * and adjusting start time for the paragraph etc..
 */
// import getClosestBlock from '../get-closest-block';
import {
  alignBlock,
  countWords,
  isTextAndWordsListChanged,
} from '@transcriptor/util';
import assert from 'assert';
import { BaseEditor, Element } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { collapseSelectionToASinglePoint } from '../collapse-selection-to-a-single-point';
import createNewParagraphBlock from '../create-new-paragraph-block';
import getClosestBlock from '../get-closest-block';
import { insertNodesAtSelection } from '../insert-nodes-at-selection';
import { removeNodes } from '../remove-nodes';
import { isBeginningOfTheBlock } from './is-beginning-of-the-block';
import { isEndOfTheBlock } from './is-end-of-the-block';
import { isSameBlock } from './is-same-block';
import { isSelectionCollapsed } from './is-selection-collapsed';
import { isTextSameAsWordsList } from './is-text-same-as-words-list';
import { splitTextAtOffset } from './split-text-at-offset';
import splitWordsListAtOffset from './split-words-list-at-offset';

/**
 *
 * @param {*} editor slate editor
 * @return {boolean} - to signal if it was successful at splitting to a parent function
 */
export function handleSplitParagraph(
  editor: BaseEditor & ReactEditor & HistoryEditor
): boolean {
  // get char offset
  assert(editor.selection);
  const { anchor, focus } = editor.selection;
  const { offset: anchorOffset, path: anchorPath } = anchor;
  const { offset: focusOffset, path: focusPath } = focus;

  if (isSameBlock(anchorPath, focusPath)) {
    if (isBeginningOfTheBlock(anchorOffset, focusOffset)) {
      console.info(
        'in the same block, but at the beginning of a paragraph for now you are not allowed to create an empty new line'
      );
      return false;
    }

    if (isSelectionCollapsed(anchorOffset, focusOffset)) {
      // get current block
      const [blockNode, path] = getClosestBlock(editor);
      const currentBlockNode = blockNode;
      // split into two blocks
      assert(Element.isElement(currentBlockNode));
      let currentBlockWords = currentBlockNode.children[0].words;
      let text = currentBlockNode.children[0].text;

      if (
        isEndOfTheBlock({
          anchorOffset,
          focusOffset,
          totalChar: text.split('').length,
        })
      ) {
        console.info(
          'in the same block, but at the end of a paragraph for now you are not allowed to create an empty new line'
        );
        return false;
      }

      // if the word have changed. then re-align paragraph before splitting.
      // TODO: this needs re-thinking if there's other re-alignment happening
      // eg on key down debounce
      if (isTextAndWordsListChanged({ text, words: currentBlockWords })) {
        const currentBlockNodeAligned = alignBlock({
          block: currentBlockNode,
          text,
          words: currentBlockWords,
        });
        currentBlockWords = currentBlockNodeAligned.children[0].words;
        text = currentBlockNodeAligned.children[0].text;
      }
      // split text in
      const [textBefore, textAfter] = splitTextAtOffset(text, anchorOffset);
      // also split words list
      // TODO: edge case splitting in the middle of a word eg find a way to prevent that for now? or is not a problem?
      const numberOfWordsBefore = countWords(textBefore);
      const [wordsBefore, wordsAfter] = splitWordsListAtOffset(
        currentBlockWords,
        numberOfWordsBefore
      );
      // if cursor in the middle of a word then move cursor to space just before

      const isCaretInMiddleOfAWord = isTextSameAsWordsList(
        textBefore,
        wordsBefore
      );
      if (isCaretInMiddleOfAWord) {
        return false;
      }
      // get start time of first block
      const { speaker, start } = currentBlockNode;
      // adjust previousTimings
      const blockParagraphBefore = createNewParagraphBlock({
        speaker,
        start,
        text: textBefore,
        words: wordsBefore,
      });
      // adjust start time (start and startTimecode) of second block, which is start time of second lsit of words
      const startTimeSecondParagraph = wordsAfter[0].start;
      const blockParagraphAfter = createNewParagraphBlock({
        speaker,
        start: startTimeSecondParagraph,
        text: textAfter,
        words: wordsAfter,
      });

      //delete original block
      removeNodes({ editor, options: {} });
      // insert these two blocks
      insertNodesAtSelection({
        editor,
        blocks: [blockParagraphBefore, blockParagraphAfter],
        moveSelection: true,
      });
      return true;
    } else {
      console.info(
        'in same block but with wide selection, not handling this use case for now, and collapsing the selection instead'
      );
      collapseSelectionToASinglePoint(editor);
      return false;
    }
  } else {
    console.info(
      'in different block, not handling this use case for now, and collapsing the selection instead'
    );
    collapseSelectionToASinglePoint(editor);
    return false;
  }
}
