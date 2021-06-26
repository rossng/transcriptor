import { BaseEditor, Editor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export function breakParagraph(editor: BaseEditor & ReactEditor & HistoryEditor): void {
  Editor.insertBreak(editor);
}
