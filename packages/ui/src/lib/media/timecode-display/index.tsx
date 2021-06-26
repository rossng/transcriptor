import { Text } from '@chakra-ui/react';
import { shortTimecode } from '@transcriptor/util';
import {
  useMediaPlayerContext,
  useMediaPlayerTime,
} from '../../misc/media-player-context';

export function TimecodeDisplay(): JSX.Element {
  const { duration } = useMediaPlayerContext();
  const currentTime = useMediaPlayerTime();

  return (
    <Text>
      <code style={{ color: 'grey' }}>{shortTimecode(currentTime)}</code>
      <span style={{ color: 'grey' }}> {' | '}</span>
      <code style={{ color: 'grey' }}>
        {duration ? `${shortTimecode(duration)}` : '00:00:00'}
      </code>
    </Text>
  );
}
