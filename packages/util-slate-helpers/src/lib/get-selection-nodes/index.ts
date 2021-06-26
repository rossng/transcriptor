import assert from 'assert';
import { BaseEditor, BaseSelection } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { CustomText, TranscriptWord } from 'types/slate';

export function getSelectionNodes(
  editor: BaseEditor & ReactEditor & HistoryEditor,
  selection: BaseSelection
): { startWord: TranscriptWord; endWord: TranscriptWord } | undefined {
  try {
    assert(selection);
    const orderedSelection = [selection.anchor, selection.focus].sort((a, b) => {
      return a.path[0] - b.path[0];
    });
    const selectionStart = orderedSelection[0];
    const selectionEnd = orderedSelection[1];
    let counterAnchor = 0;
    const goalAnchor = selectionStart.offset;
    let targetWordIndexAnchor = null;
    const selectedLeafWordsAnchor = ((editor.children[selectionStart.path[0]] as unknown as Element).children[0] as unknown as CustomText).words;
    // let pathValue = selectionStart.path;
    // let selectedLeafWordsAnchor2 = editor.children[selectionStart.path].children[0].words;

    selectedLeafWordsAnchor.forEach((word, wordIndex) => {
      const wordLength = (word.text + ' ').length;

      counterAnchor = counterAnchor + wordLength;
      if (counterAnchor <= goalAnchor) {
        targetWordIndexAnchor = wordIndex;
      }
    });

    assert(targetWordIndexAnchor);
    const startWord = selectedLeafWordsAnchor[targetWordIndexAnchor + 1];

    let counter = 0;
    const goal = selectionEnd.offset;
    let targetWordIndex = null;
    const selectedLeafWords = ((editor.children[selectionEnd.path[0]] as unknown as Element).children[0] as unknown as CustomText).words;
    selectedLeafWords.forEach((word, wordIndex) => {
      const wordLength = (word.text + ' ').length;

      counter = counter + wordLength;
      if (counter <= goal) {
        targetWordIndex = wordIndex;
      }
    });

    assert(targetWordIndex);
    const endWord = selectedLeafWords[targetWordIndex + 1];
    // return { startSec: startWord.start, endSec: endWord.end };
    return { startWord, endWord };
  } catch (error) {
    console.error('error finding times from selection:: ', error);
  }
}
