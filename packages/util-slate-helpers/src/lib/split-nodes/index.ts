/*

https://github.com/ianstormtaylor/slate/blob/b5859b7e2ef97cdc5d5aaa675b807c4783b2e83c/packages/slate/src/transforms/node.ts#L584-L595

const splitMode = mode === 'lowest' ? 'lowest' : 'highest'

Transforms.splitNodes(editor, {
    at: end,
    match,
    mode: splitMode,
    voids,
})

https://docs.slatejs.org/api/transforms#transforms-splitnodes-editor-editor-options

Split nodes at the specified location. If no location is specified, split the selection.
Options supported: NodeOptions & {height?: number, always?: boolean}

Transforms.splitNodes(editor: Editor, options?)
 */

import { BaseEditor, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
export function splitNodes(editor: BaseEditor & ReactEditor & HistoryEditor, options = {}): void {
  Transforms.splitNodes(editor, options);
}
