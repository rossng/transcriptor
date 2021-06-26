import { shortTimecode } from '@transcriptor/util';
import { Element } from 'slate';

function createNewParagraphBlock({
  speaker,
  start,
  text = '',
  words = [],
  startTimecode,
}: {
  speaker: any;
  start: any;
  text: string;
  words: any;
  startTimecode?: any;
}): Element {
  let newStartTimecode = startTimecode;
  if (!newStartTimecode) {
    newStartTimecode = shortTimecode(start);
  }
  return {
    speaker,
    start,
    startTimecode: newStartTimecode,
    type: 'timedText',
    children: [
      {
        text,
        words,
      },
    ],
  };
}

export default createNewParagraphBlock;
