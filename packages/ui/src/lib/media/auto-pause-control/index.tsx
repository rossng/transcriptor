import {
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import { useTranscriptEditorContext } from '../../misc/transcript-editor-context';

export function AutoPauseControl(): JSX.Element {
  const {
    handleAnalyticsEvents,
    setIsPauseWhileTyping,
    isPauseWhileTyping,
    isEditable,
  } = useTranscriptEditorContext();

  const handleSetPauseWhileTyping = () => {
    if (handleAnalyticsEvents) {
      // handles if click cancel and doesn't set speaker name
      handleAnalyticsEvents('ste_handle_set_pause_while_typing', {
        fn: 'handleSetPauseWhileTyping',
        isPauseWhileTyping: !isPauseWhileTyping,
      });
    }
    setIsPauseWhileTyping(!isPauseWhileTyping);
  };

  return isEditable ? (
    <Tooltip
      label={`Turn ${
        isPauseWhileTyping ? 'off' : 'on'
      } pause while typing functionality. As
          you start typing the media while pause playback until you stop. Not
          recommended on longer transcript as it might present performance issues.`}
    >
      <FormControl>
        <Flex alignItems="center">
          <FormLabel>Pause media while typing</FormLabel>
          <Switch
            color="primary"
            isChecked={isPauseWhileTyping}
            onChange={handleSetPauseWhileTyping}
          />
        </Flex>
      </FormControl>
    </Tooltip>
  ) : (
    <></>
  );
}
