export function isBeginningOfTheBlock(anchorOffset: number, focusOffset: number): boolean {
  return anchorOffset === 0 && focusOffset === 0;
}
