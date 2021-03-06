export function removeExtraWhiteSpaces(text: string): string {
  return text.trim().replace(/\s\s+/g, ' ');
}

export function splitOnWhiteSpaces(text: string): string[] {
  return removeExtraWhiteSpaces(text).split(' ');
}

export function countChar(text: string): number {
  // remove white spaces and count chat
  return splitOnWhiteSpaces(text).join('').length;
}

export function countWords(text: string): number {
  // return text.trim().replace(/\n /g, '').replace(/\n/g, ' ').split(' ').length;
  // Don't count multiple spaces as multiple words
  // https://www.w3schools.com/jsref/jsref_regexp_whitespace.asp
  // Do a global search for whitespace characters in a string
  return splitOnWhiteSpaces(text).length;
}
