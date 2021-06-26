export function addLineBreakBetweenSentences(text: string): string {
  return text.replace(/\n/g, '\n\n');
}
