import { removeSpaceAtBeginningOfLine } from '../util/remove-space-at-beginning-of-line';

export function divideIntoTwoLines(text: string): string {
  const lines = text.split('\n');

  let counter = 0;

  let result = lines
    .map((l) => {
      if (l === '') {
        return l;
      } else {
        if (counter === 0) {
          counter += 1;
          if (l[l.length - 1][0] === '.') {
            return l + '\n\n';
          }

          return l + '\n';
        } else if (counter === 1) {
          counter = 0;

          return l + '\n\n';
        }
      }
    })
    .filter(notEmpty);

  result = removeSpaceAtBeginningOfLine(result);
  // remove empty lines from list to avoid unwanted space a beginning of line
  result = result.filter((line) => line.length !== 0);

  return result.join('').trim();
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
