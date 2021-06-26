import { removeSpaceAfterCarriageReturn } from '../util/remove-space-after-carriage-return';

/*
 * Helper function
 * folds array of words
 * adds `\n`
 * foldNumber = char after which to fold. eg 35 char default
 * TODO: this could be refactored with smaller helper functions
 */
function foldWordsReturnArray(textArray: string[], foldNumber = 35) {
  let counter = 0;
  const result = textArray.map((word, index, list) => {
    counter += word.length + 1;
    //resetting counter when there is a 'paragraph' line break \n\n
    if (counter <= foldNumber) {
      // if not last word in list
      // cover edge case last element in array does not have a next element
      if (list[index + 1] !== undefined) {
        const nextElementLength = list[index + 1].length;
        //check if adding next word would make the line go over the char limit foldNumber
        if (counter + nextElementLength < foldNumber) {
          return word;
        } else {
          // if it makes it go over, reset counter, return and add line break
          counter = 0;

          return `${word}\n`;
        }
        //last word in the list
      } else {
        return word;
      }
      // if not greater then char foldNumber
    } else {
      counter = 0;

      return `${word}\n`;
    }
  });

  return result;
}

/*
 * text string of words
 * foldNumber = char after which to fold. eg 35 char.
 */
export function foldWords(text: string, foldNumber: number): string {
  // split on two line break
  const lineArr = text.split('\n\n');
  // fold each line on non fold number char count
  const foldedWordsInArray = lineArr.map((line) => {
    return foldWordsReturnArray(line.split(' '), foldNumber);
  });
  // flatten result
  const foldedWordsFlatten = foldedWordsInArray.map((line) => {
    return line.join(' ');
  });

  // remove space after carriage return \n in lines
  const result = foldedWordsFlatten.map((r) => {
    return removeSpaceAfterCarriageReturn(r);
  });
  // return text

  return result.join('\n\n');
}
