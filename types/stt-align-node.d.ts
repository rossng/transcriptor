declare module 'stt-align-node' {
  import { TranscriptData } from '../util/dpe-to-slate';
  function alignSTT(words: TranscriptData, text: string): TranscriptWords[];
}
