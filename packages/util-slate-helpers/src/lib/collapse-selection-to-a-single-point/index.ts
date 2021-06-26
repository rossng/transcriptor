// https://docs.slatejs.org/api/transforms#transforms-collapse-editor-editor-options
// Collapse the selection to a single point.
// Options: {edge?: 'anchor' | 'focus' | 'start' | 'end'}

import { BaseEditor, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export function collapseSelectionToASinglePoint(editor: BaseEditor & ReactEditor & HistoryEditor): void {
  Transforms.collapse(editor, { edge: 'start' });
}
