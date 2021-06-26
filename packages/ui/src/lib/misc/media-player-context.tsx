import { getSelectionNodes } from '@transcriptor/util-slate-helpers';
import assert from 'assert';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import {
  useTranscriptEditorContext,
  useTranscriptValue,
} from './transcript-editor-context';

interface MediaPlayerCtx {
  currentTime: number;
  other: {
    duration: number;
    handleTimedTextClick: (event: React.MouseEvent<HTMLElement>) => void;
    mediaRef: React.RefObject<HTMLVideoElement>;
    playbackRate: number;
    setPlaybackRate: (rate: number) => void;
    // currentIndex: number;
  };
}

export const MediaPlayerContext = createContext<MediaPlayerCtx | undefined>(
  undefined
);

export function useMediaPlayerContext(): MediaPlayerCtx['other'] {
  const ctx = useContextSelector(MediaPlayerContext, (v) => v?.other);
  if (!ctx) {
    throw new Error(
      'MediaPlayerContext not available - are you outside the provider?'
    );
  }
  return ctx;
}

export function useMediaPlayerTime(): number {
  const ctx = useContextSelector(MediaPlayerContext, (v) => v?.currentTime);
  if (ctx !== 0 && !ctx) {
    throw new Error(
      'MediaPlayerContext not available - are you outside the provider?'
    );
  }
  return ctx;
}

export function MediaPlayerContextProvider({
  children,
}: PropsWithChildren<Record<never, never>>): JSX.Element {
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const { editor, handleAnalyticsEvents } = useTranscriptEditorContext();
  const { value } = useTranscriptValue();

  const handleTimeUpdated = useCallback((e) => {
    setCurrentTime(e.target.currentTime);
    // TODO: setting duration here as a workaround
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
    //  TODO: commenting this out for now, not sure if it will fire to often?
    // if (props.handleAnalyticsEvents) {
    //   // handles if click cancel and doesn't set speaker name
    //   props.handleTimeUpdated('ste_handle_time_update', {
    //     fn: 'handleTimeUpdated',
    //     duration: mediaRef.current.duration,
    //     currentTime: e.target.currentTime,
    //   });
    // }
  }, []);

  useEffect(() => {
    // Update the document title using the browser API
    if (mediaRef && mediaRef.current) {
      // setDuration(mediaRef.current.duration);
      const current = mediaRef.current;
      current.addEventListener('timeupdate', handleTimeUpdated);

      return function cleanup() {
        // removeEventListener
        current.removeEventListener('timeupdate', handleTimeUpdated);
      };
    } else {
      console.warn('Could not register handleTimeUpdated');
    }
  }, [handleTimeUpdated, mediaRef]);

  const handleTimedTextClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('timecode')) {
        const start = target.dataset.start;
        if (mediaRef && mediaRef.current) {
          mediaRef.current.currentTime = parseFloat(start ?? '0');
          mediaRef.current.play();

          // handles if click cancel and doesn't set speaker name
          handleAnalyticsEvents?.('ste_handle_timed_text_click', {
            fn: 'handleTimedTextClick',
            clickOrigin: 'timecode',
            timeInSeconds: mediaRef.current.currentTime,
          });
        }
      } else if (target.dataset.slateString) {
        const parentNode = target.parentNode as HTMLElement;
        if (parentNode.dataset.start) {
          const selectionNodes = getSelectionNodes(editor, editor.selection);
          assert(selectionNodes?.startWord);
          const startWord = selectionNodes.startWord;
          if (mediaRef && mediaRef.current && startWord && startWord.start) {
            mediaRef.current.currentTime = startWord.start;
            mediaRef.current.play();

            // handles if click cancel and doesn't set speaker name
            handleAnalyticsEvents?.('ste_handle_timed_text_click', {
              fn: 'handleTimedTextClick',
              clickOrigin: 'word',
              timeInSeconds: mediaRef.current.currentTime,
            });
          } else {
            // fallback in case there's some misalignment with the words
            // use the start of paragraph instead
            const start = parseFloat(parentNode.dataset.start);
            if (mediaRef && mediaRef.current && start) {
              mediaRef.current.currentTime = start;
              mediaRef.current.play();

              // handles if click cancel and doesn't set speaker name
              handleAnalyticsEvents?.('ste_handle_timed_text_click', {
                fn: 'handleTimedTextClick',
                origin: 'paragraph-fallback',
                timeInSeconds: mediaRef.current.currentTime,
              });
            }
          }
        }
      }
    },
    [editor, handleAnalyticsEvents, mediaRef]
  );

  // const currentIndex = useMemo(() => {
  //   return R.findLastIndex(R.propSatisfies<number, Descendant>((start: number) => start < currentTime, 'start'))(value);
  // }, [currentTime, value]);

  const other = useMemo(
    (): MediaPlayerCtx['other'] => ({
      duration,
      handleTimedTextClick,
      mediaRef,
      playbackRate,
      setPlaybackRate,
    }),
    [duration, handleTimedTextClick, playbackRate]
  );

  const ctx = useMemo(
    (): MediaPlayerCtx => ({
      currentTime,
      other,
    }),
    [currentTime, other]
  );

  return (
    <MediaPlayerContext.Provider value={ctx}>
      {children}
    </MediaPlayerContext.Provider>
  );
}
