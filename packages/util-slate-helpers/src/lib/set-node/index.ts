/*
https://github.com/dylans/slate-snippets#set-node

Transforms.setNodes(editor, { type: 'paragraph' }, { at: path });
*/

import { BaseEditor, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export function setNode({ editor, block, path }: { editor: BaseEditor & ReactEditor & HistoryEditor; block: any; path: any }): void {
  Transforms.setNodes(editor, block, { at: path });
}
