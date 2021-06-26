import { useMediaPlayerContext } from '../../misc/media-player-context';
import { useTranscriptEditorContext } from '../../misc/transcript-editor-context';

export function MediaPlayer(): JSX.Element {
  const { mediaUrl } = useTranscriptEditorContext();
  const { mediaRef } = useMediaPlayerContext();

  return (
    <video
      style={{ backgroundColor: 'black' }}
      ref={mediaRef}
      src={mediaUrl}
      width={'100%'}
      controls
      playsInline
    ></video>
  );
}
