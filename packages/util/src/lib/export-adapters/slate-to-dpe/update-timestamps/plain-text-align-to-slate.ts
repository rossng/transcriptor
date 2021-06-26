import assert from 'assert';
import { Descendant, Element } from 'slate';
import { alignSTT } from 'stt-align-node';
import { TranscriptWord } from 'types/slate';
import { countWords } from '../../../count-words';
import { TranscriptData } from '../../../dpe-to-slate';
import { shortTimecode } from '../../../timecode-converter';

const createSlateContentFromSlateJsParagraphs = (currentContent: Descendant[], newEntities: TranscriptWord[]): Descendant[] => {
  // Update entities to block structure.
  const updatedBlockArray = [];
  let totalWords = 0;

  for (const block in currentContent) {
    //const block = currentContent[blockIndex];
    assert(Element.isElement(block));
    const text = block.children[0].text;
    // if copy and pasting large chunk of text
    // currentContentBlock, would not have speaker and start/end time info
    // so for updatedBlock, getting start time from first word in blockEntities
    const wordsInBlock = countWords(text);
    const blockEntities = newEntities.slice(totalWords, totalWords + wordsInBlock);
    let speaker = block.speaker;
    const start = parseFloat(blockEntities[0].start as unknown as string);
    // const end = parseFloat(blockEntities[blockEntities.length - 1].end);
    // const currentParagraph = { start, end };
    // The speakers would also not exist. Unless in future iteration
    // ad option to have a convention for speaker formatting, eg all caps with : at beginning of sentence
    // or something like that but out of scope for now.
    if (!speaker) {
      speaker = 'U_UKN';
    }

    const newText = blockEntities
      .map((w) => {
        return w.text;
      })
      .join(' ')
      .trim();

    const updatedBlock: Descendant = {
      type: 'timedText',
      speaker: speaker,
      start,
      startTimecode: shortTimecode(start),
      children: [
        {
          text: newText,
          words: blockEntities,
        },
      ],
    };

    updatedBlockArray.push(updatedBlock);
    totalWords += wordsInBlock;
  }
  return updatedBlockArray;
};

export function plainTextAlignToSlateJs(words: TranscriptData, text: string, slateJsValue: Descendant[]): Descendant[] {
  // TODO: maybe there's a more performant way to do this?
  // As on larger over 1 hour transcript it might freeze the UI 🤷‍♂️
  const alignedWords = alignSTT(words, text);
  const updatedBlockArray = createSlateContentFromSlateJsParagraphs(slateJsValue, alignedWords);
  return updatedBlockArray;
}
