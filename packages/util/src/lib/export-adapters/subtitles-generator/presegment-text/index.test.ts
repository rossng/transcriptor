import fs from 'fs';
import { words as sampleWords } from '../sample/words-list.sample.json';
import { preSegmentText } from './';

// fs path is relative to where the node process starts
const sampleSegmentedOutput = fs.readFileSync('./src/util/export-adapters/subtitles-generator/sample/test-presegment.sample.txt').toString();

const numberOfCharPerLine35 = 35;

xtest('presegment text ', () => {
  const result = preSegmentText(sampleWords);
  expect(result).toEqual(sampleSegmentedOutput);
});

xtest('presegment text - 35', () => {
  const result = preSegmentText(sampleWords, numberOfCharPerLine35);
  expect(result).toEqual(sampleSegmentedOutput);
});
