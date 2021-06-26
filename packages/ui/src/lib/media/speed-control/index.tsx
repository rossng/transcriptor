import { FormControl } from '@chakra-ui/form-control';
import { Flex, FormLabel, Select } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useMediaPlayerContext } from '../../misc/media-player-context';
import { useTranscriptEditorContext } from '../../misc/transcript-editor-context';

const PLAYBACK_RATE_VALUES = [0.2, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 3, 3.5];

export function SpeedControl(): JSX.Element {
  const { handleAnalyticsEvents } = useTranscriptEditorContext();
  const { playbackRate, setPlaybackRate, mediaRef } = useMediaPlayerContext();

  const handleSetPlaybackRate = useCallback(
    (e) => {
      const previousPlaybackRate = playbackRate;
      const n = e.target.value;
      const tmpNewPlaybackRateValue = parseFloat(n);
      if (mediaRef && mediaRef.current) {
        mediaRef.current.playbackRate = tmpNewPlaybackRateValue;
        setPlaybackRate(tmpNewPlaybackRateValue);

        handleAnalyticsEvents?.('ste_handle_set_playback_rate', {
          fn: 'handleSetPlaybackRate',
          previousPlaybackRate,
          newPlaybackRate: tmpNewPlaybackRateValue,
        });
      }
    },
    [playbackRate, mediaRef, setPlaybackRate, handleAnalyticsEvents]
  );

  return (
    <FormControl>
      <Flex alignItems="center">
        <FormLabel>Speed</FormLabel>
        <Select value={playbackRate} onChange={handleSetPlaybackRate} w="max-content">
          {PLAYBACK_RATE_VALUES.map((playbackRateValue, index) => {
            return (
              <option key={index + playbackRateValue} value={playbackRateValue}>
                {playbackRateValue}x
              </option>
            );
          })}
        </Select>
      </Flex>
    </FormControl>
  );
}
