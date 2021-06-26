// https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
export function download(content: any, filename: string, contentType?: string): void {
  const type = contentType || 'application/octet-stream';
  const link = document.createElement('a');
  const blob = new Blob([content], { type: type });

  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  // Firefox fix - cannot do link.click() if it's not attached to DOM in firefox
  // https://stackoverflow.com/questions/32225904/programmatical-click-on-a-tag-not-working-in-firefox
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
