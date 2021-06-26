/**
 * Get node by path
 * https://github.com/dylans/slate-snippets#get-node-by-path
 * Get the descendant node referred to by a specific path. If the path is an empty array, get the root node itself.
 * https://docs.slatejs.org/api/nodes
 */
import { BaseEditor, Node } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export function getNodeByPath({ editor, path }: { editor: BaseEditor & ReactEditor & HistoryEditor; path: any }): Node {
  const node = Node.get(editor, path);
  return node;
}
