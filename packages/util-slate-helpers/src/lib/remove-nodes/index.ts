/*
https://docs.slatejs.org/api/transforms#transforms-removenodes-editor-editor-options

Transforms.removeNodes(editor: Editor, options?)
Remove nodes at the specified location in the document. If no location is specified, remove the nodes in the selection.
Options supported: NodeOptions & {hanging?: boolean}

*/
import { BaseEditor, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export function removeNodes({ editor, options = {} }: { editor: BaseEditor & ReactEditor & HistoryEditor; options: any }): void {
  Transforms.removeNodes(editor, options);
}
