/*
 from ~https://github.com/dylans/slate-snippets#get-closest-block~
from https://github.com/ianstormtaylor/slate/blob/228f4fa94f61f42ca41feae2b3029ebb570e0480/packages/slate/src/transforms/text.ts#L108-L112
 const startBlock = Editor.above(editor, {
   match: (n) => Editor.isBlock(editor, n),
     at: start,
     voids,
 });
 return startBlock;
*/
import assert from 'assert';
import { Ancestor, BaseEditor, Editor, Path } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

function getClosestBlock(editor: BaseEditor & ReactEditor & HistoryEditor): [Ancestor, Path] {
  const closest = Editor.above(editor, { match: (n) => Editor.isBlock(editor, n) });
  assert(closest);
  return closest;
}
export default getClosestBlock;
