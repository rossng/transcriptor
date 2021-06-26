import { Button, Flex, Tooltip } from '@chakra-ui/react';
import { MdForward10, MdReplay10 } from 'react-icons/md';
import { useMediaPlayerContext } from '../../misc/media-player-context';
import { useTranscriptEditorContext } from '../../misc/transcript-editor-context';

const SEEK_BACK_SEC = 10;
export function SeekControls(): JSX.Element {
  const { handleAnalyticsEvents } = useTranscriptEditorContext();
  const { mediaRef } = useMediaPlayerContext();

  const handleSeekBack = () => {
    if (mediaRef && mediaRef.current) {
      const newCurrentTime = mediaRef.current.currentTime - SEEK_BACK_SEC;
      mediaRef.current.currentTime = newCurrentTime;

      handleAnalyticsEvents?.('ste_handle_seek_back', {
        fn: 'handleSeekBack',
        newCurrentTimeInSeconds: newCurrentTime,
        seekBackValue: SEEK_BACK_SEC,
      });
    }
  };

  const handleFastForward = () => {
    if (mediaRef && mediaRef.current) {
      const newCurrentTime = mediaRef.current.currentTime + SEEK_BACK_SEC;
      mediaRef.current.currentTime = newCurrentTime;

      handleAnalyticsEvents?.('ste_handle_fast_forward', {
        fn: 'handleFastForward',
        newCurrentTimeInSeconds: newCurrentTime,
        seekBackValue: SEEK_BACK_SEC,
      });
    }
  };
  return (
    <Flex flexDir="row">
      <Tooltip label={`Seek back by ${SEEK_BACK_SEC} seconds`}>
        <Button color="primary" onClick={handleSeekBack}>
          <MdReplay10 color="primary" fontSize="large" size={32} />
        </Button>
      </Tooltip>
      <Tooltip label={`Fast forward by ${SEEK_BACK_SEC} seconds`}>
        <Button color="primary" onClick={handleFastForward} ml={2}>
          <MdForward10 color="primary" fontSize="large" size={32} />
        </Button>
      </Tooltip>
    </Flex>
  );
}
