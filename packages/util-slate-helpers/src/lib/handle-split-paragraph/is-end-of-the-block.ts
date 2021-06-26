/**
 * This helper function checks if the cursor/caret is at the end of a line
 * by comparing the anchros offset with the focus offset and seeing if they are equal to the total number
 * of chars in that block
 *
 * There seems to be an alternative way of doing this that could also be explored
 * https://github.com/udecode/slate-plugins/blob/master/packages/slate-plugins/src/common/queries/isSelectionAtBlockEnd.ts
 */
export function isEndOfTheBlock({ anchorOffset, focusOffset, totalChar }: { anchorOffset: number; focusOffset: number; totalChar: number }): boolean {
  return anchorOffset === focusOffset && anchorOffset === totalChar;
}
