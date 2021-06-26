export function isSelectionCollapsed(anchorOffset: number, focusOffset: number): boolean {
  return anchorOffset === focusOffset;
}
