/**
 *
 * @param text -text string
 * @param offset - offset char number position/index
 */
export function splitTextAtOffset(text: string, offset: number): [string, string] {
  const textBefore = text.slice(0, offset);
  const textAfter = text.slice(offset);
  return [textBefore, textAfter];
}
