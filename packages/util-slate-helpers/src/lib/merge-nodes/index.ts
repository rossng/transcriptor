/*
https://docs.slatejs.org/api/transforms#transforms-mergenodes-editor-editor-options
Merge a node at the specified location with the previous node at the same depth. If no location is specified, use the selection. Resulting empty container nodes are removed.
Options supported: NodeOptions & {hanging?: boolean}
*/
import { BaseEditor, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export function mergeNodes({ editor, options = {} }: { editor: BaseEditor & ReactEditor & HistoryEditor; options: any }): void {
  Transforms.mergeNodes(editor, options);
}
