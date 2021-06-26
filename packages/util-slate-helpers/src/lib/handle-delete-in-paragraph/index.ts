import { alignBlock, isTextAndWordsListChanged } from '@transcriptor/util';
import assert from 'assert';
import { BaseEditor, Element, Location } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { collapseSelectionToASinglePoint } from '../collapse-selection-to-a-single-point';
import createNewParagraphBlock from '../create-new-paragraph-block';
import getClosestBlock from '../get-closest-block';
import { getNodeByPath } from '../get-node-by-path';
import { isBeginningOfTheBlock } from '../handle-split-paragraph/is-beginning-of-the-block';
import { isSameBlock } from '../handle-split-paragraph/is-same-block';
import { isSelectionCollapsed } from '../handle-split-paragraph/is-selection-collapsed';
import { insertNodesAtSelection } from '../insert-nodes-at-selection';
import { removeNodes } from '../remove-nodes';
import { setSelection } from '../set-selection';

/**
 *
 * @return {boolean} - to signal if it was successful at splitting to a parent function
 */
// TODO: refactor clean up to make more legible
export function handleDeleteInParagraph({
  editor,
  event,
}: {
  editor: BaseEditor & ReactEditor & HistoryEditor;
  event: any;
}): boolean {
  assert(editor.selection);
  const { anchor, focus } = editor.selection;

  const { offset: anchorOffset, path: anchorPath } = anchor;
  const { offset: focusOffset, path: focusPath } = focus;

  if (isSameBlock(anchorPath, focusPath)) {
    if (isBeginningOfTheBlock(anchorOffset, focusOffset)) {
      event.preventDefault();
      console.info(
        'in the same block, but at the beginning of a paragraph for now you are not allowed to create an empty new line'
      );
      const [blockNode, path] = getClosestBlock(editor);
      const currentBlockNode = blockNode;
      const currentBlockNumber = path[0];
      if (currentBlockNumber === 0) {
        return false;
      }

      const previousBlockNumber = currentBlockNumber - 1;
      const previousBlock = getNodeByPath({
        editor,
        path: [previousBlockNumber],
      });

      assert(Element.isElement(currentBlockNode));
      assert(Element.isElement(previousBlock));
      const previousBlockEndOffset = previousBlock.children[0].text.length;
      const previousBlockText = previousBlock.children[0].text;
      const previousBlockWordsList = previousBlock.children[0].words;
      let currentBlockText = currentBlockNode.children[0].text;
      let currentBlockWordsList = currentBlockNode.children[0].words;
      // if the word have changed. then re-align paragraph before splitting.
      // TODO: this needs re-thinking if there's other re-alignment happening
      // eg on key down debounce
      if (
        isTextAndWordsListChanged({
          text: currentBlockText,
          words: currentBlockWordsList,
        })
      ) {
        const currentBlockNodeAligned = alignBlock({
          block: currentBlockNode,
          text: currentBlockText,
          words: currentBlockWordsList,
        });
        currentBlockWordsList = currentBlockNodeAligned.children[0].words;
        currentBlockText = currentBlockNodeAligned.children[0].text;
      }

      const newText = previousBlockText + ' ' + currentBlockText;
      const newWords = [...previousBlockWordsList, ...currentBlockWordsList];

      const range = {
        anchor: {
          path: [currentBlockNumber, 0],
          offset: 0,
        },
        focus: {
          path: [previousBlockNumber, 0],
          offset: previousBlockEndOffset,
        },
      };

      const options = {
        at: range,
        mode: 'highest',
      };
      //   const startTimeSecondParagraph = wordsAfter[0].start;
      const { speaker, start, startTimecode } = currentBlockNode;
      const newBlockParagraph = createNewParagraphBlock({
        speaker,
        start,
        startTimecode,
        text: newText,
        words: newWords,
      });

      removeNodes({ editor, options });

      const options2: { at: Location; mode: 'highest' } = {
        at: [previousBlockNumber],
        mode: 'highest',
      };
      insertNodesAtSelection({
        editor,
        blocks: [newBlockParagraph],
        moveSelection: false,
        options: options2,
      });

      // move the selection to in the "middle" of the new paragraph where the text of the two is joined.s
      const newOffset = previousBlockText.length;
      const nextPoint = { offset: newOffset, path: [previousBlockNumber, 0] };
      setSelection({ editor, nextPoint });
      return true;
    }
    if (isSelectionCollapsed(anchorOffset, focusOffset)) {
      //  In same block but with selection collapsed
      // event.preventDefault();
      return false;
    } else {
      // In same block but with wide selection
      //   event.preventDefault();
      return false;
    }
  } else {
    event.preventDefault();
    console.info(
      'in different block, not handling this use case for now, and collapsing the selection instead'
    );
    collapseSelectionToASinglePoint(editor);
    return false;
  }
}
