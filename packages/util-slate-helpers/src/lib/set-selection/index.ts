// https://docs.slatejs.org/api/transforms#transforms-setselection-editor-editor-props-partial-less-than-range-greater-than
// Set new properties on the selection.
import { BaseEditor, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export function setSelection({ editor, nextPoint }: { editor: BaseEditor & ReactEditor & HistoryEditor; nextPoint: any }): void {
  Transforms.setSelection(editor, { anchor: nextPoint, focus: nextPoint });
}
