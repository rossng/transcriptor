import {
  Box,
  ChakraProvider,
  extendTheme,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { TranscriptData } from '@transcriptor/util';
import { PropsWithChildren, useEffect } from 'react';
import { Descendant } from 'slate';
import { TranscriptEditor } from '../editor/transcript-editor';
import { AutoPauseControl } from '../media/auto-pause-control';
import { MediaPlayer } from '../media/media-player';
import { SeekControls } from '../media/seek-controls';
import { SpeedControl } from '../media/speed-control';
import { TimecodeDisplay } from '../media/timecode-display';
import { MenuButtons } from '../menus/menu-buttons';
import { Instructions } from '../misc/instructions';
import { MediaPlayerContextProvider } from '../misc/media-player-context';
import { SpeakersCheatSheet } from '../misc/speakers-cheat-sheet';
import {
  TranscriptEditorContextProvider,
  useTranscriptEditorStatus,
} from '../misc/transcript-editor-context';

export interface Props {
  transcriptData: TranscriptData;
  mediaUrl: string;
  handleSaveEditor: (value: string) => void;
  handleAutoSaveChanges?: (value: Descendant[]) => void;
  autoSaveContentType: 'digitalpaperedit' | 'slate';
  isEditable?: boolean;
  showTimecodes?: boolean;
  showSpeakers?: boolean;
  showTitle?: boolean;
  title?: string;
  transcriptDataLive?: TranscriptData;
  handleAnalyticsEvents?: (
    eventName: string,
    properties: { fn: string; [key: string]: any }
  ) => void;
  mediaType?: string;
}

DefaultLayout.defaultProps = {
  showTitle: false,
  showTimecodes: true,
  showSpeakers: true,
  autoSaveContentType: 'digitalpaperedit',
  isEditable: true,
};

export function DefaultLayout(props: PropsWithChildren<Props>): JSX.Element {
  return (
    <TranscriptEditorContextProvider
      isEditable={props.isEditable}
      mediaUrl={props.mediaUrl}
      transcriptData={props.transcriptData}
      title={props.title}
      autoSaveContentType={props.autoSaveContentType}
      handleSaveEditor={props.handleSaveEditor}
      handleAnalyticsEvents={props.handleAnalyticsEvents}
      transcriptDataLive={props.transcriptDataLive}
    >
      <MediaPlayerContextProvider>
        <DefaultLayoutInner
          showSpeakers={
            props.showSpeakers ?? DefaultLayout.defaultProps.showSpeakers
          }
          showTimecodes={
            props.showTimecodes ?? DefaultLayout.defaultProps.showTimecodes
          }
          showTitle={props.showTitle ?? DefaultLayout.defaultProps.showTitle}
        />
      </MediaPlayerContextProvider>
    </TranscriptEditorContextProvider>
  );
}

const theme = extendTheme({});

function DefaultLayoutInner({
  showSpeakers,
  showTimecodes,
  showTitle,
  children,
  title,
}: PropsWithChildren<{
  showSpeakers: boolean;
  showTimecodes: boolean;
  title?: string;
  showTitle: boolean;
}>) {
  const { isProcessing } = useTranscriptEditorStatus();

  useEffect(() => {
    if (isProcessing) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isProcessing]);

  return (
    <ChakraProvider theme={theme}>
      <Box>
        {showTitle && <Heading as="h5">{title}</Heading>}

        <Flex spacing={2} flexDir="row">
          <Box>
            <Flex flexDir="column">
              <MediaPlayer />
              <Flex flexDir="row" justifyContent="space-between" mt={4}>
                <Box flex="1">
                  <TimecodeDisplay />
                </Box>
                <Box>
                  <SpeedControl />
                </Box>
              </Flex>
              <Flex justifyContent="center" my={4}>
                <SeekControls />
              </Flex>
              <AutoPauseControl />#
              <Box my={4}>
                <Instructions />
              </Box>
              <Box my={4}>
                <SpeakersCheatSheet />
              </Box>
              <Box>{children}</Box>
            </Flex>
          </Box>

          <Box colSpan={7}>
            <TranscriptEditor
              showSpeakers={showSpeakers}
              showTimecodes={showTimecodes}
            />
          </Box>

          <Box colSpan={1}>
            <MenuButtons />
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}
