import { action } from '@storybook/addon-actions';
import { TranscriptData } from '@transcriptor/util';
import { useEffect, useState } from 'react';
import DEMO_SOLEIO_LIVE from '../../../sample-data/segmented-transcript-soleio-dpe.json';
import { DefaultLayout } from '../default-layout';

const DEMO_MEDIA_URL_SOLEIO =
  'https://digital-paper-edit-demo.s3.eu-west-2.amazonaws.com/PBS-Frontline/The+Facebook+Dilemma+-+interviews/The+Facebook+Dilemma+-+Soleio+Cuervo-OIAUfZBd_7w.mp4';

// Parent component to simulate results from a live STT stream.
const Example = (props: any): JSX.Element => {
  // Declare a new state variable, which we'll call "count"
  const [jsonData] = useState<TranscriptData>({ words: [], paragraphs: [] });
  const [interimResults, setInterimResults] = useState({});

  useEffect(() => {
    props.transcriptInParts &&
      props.transcriptInParts.forEach(
        delayLoop((transcriptPart: any) => {
          setInterimResults(transcriptPart);
        }, 3000)
      );
  }, []);

  // https://travishorn.com/delaying-foreach-iterations-2ebd4b29ad30
  const delayLoop = (fn: any, delay: any) => {
    return (x: any, i: number) => {
      setTimeout(() => {
        fn(x);
      }, i * delay);
    };
  };

  return (
    <DefaultLayout
      mediaUrl={DEMO_MEDIA_URL_SOLEIO}
      handleSaveEditor={action('handleSaveEditor')}
      handleAutoSaveChanges={action('handleAutoSaveChanges')}
      // https://www.npmjs.com/package/@storybook/addon-knobs#select
      autoSaveContentType={'digitalpaperedit'} // digitalpaperedit or slate - digitalpaperedit, runs alignement before exporting, slate, is just the raw data.
      transcriptData={jsonData}
      transcriptDataLive={interimResults}
      isEditable={props.isEditable}
      title={props.title}
      showTitle={true}
      showTimecodes={true}
      showSpeakers={true}
    />
  );
};

export default {
  title: 'Live',
  component: Example,
};

export const NotEditable = (): JSX.Element => {
  return (
    <Example
      isEditable={false}
      transcriptInParts={DEMO_SOLEIO_LIVE}
      title={
        'Simulated a live STT interim results via a timer and segmented STT json, NOT editable'
      }
    />
  );
};

export const Editable = (): JSX.Element => {
  return (
    <Example
      isEditable={true}
      transcriptInParts={DEMO_SOLEIO_LIVE}
      title={
        'Simulated a live STT interim results via a timer and segmented STT json, editable'
      }
    />
  );
};
