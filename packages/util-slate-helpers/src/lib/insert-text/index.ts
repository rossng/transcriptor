import { BaseEditor, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export function insertText({ editor, text = '[INAUDIBLE]' }: { editor: BaseEditor & ReactEditor & HistoryEditor; text: string }): void {
  Transforms.insertText(editor, text);
}
