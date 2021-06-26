import path from 'path';

export function getMediaType(mediaUrl: string): string {
  const clipExt = path.extname(mediaUrl);
  let tmpMediaType = 'video';
  if (clipExt === '.wav' || clipExt === '.mp3' || clipExt === '.m4a' || clipExt === '.flac' || clipExt === '.aiff') {
    tmpMediaType = 'audio';
  }
  return tmpMediaType;
}
