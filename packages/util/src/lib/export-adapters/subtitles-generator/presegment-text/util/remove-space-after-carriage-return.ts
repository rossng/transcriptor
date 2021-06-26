/**
 * Helper function to remove space after carriage return \n in lines
 */
export function removeSpaceAfterCarriageReturn(text: string): string {
  return text.replace(/\n /g, '\n');
}
