import tokenizer from 'sbd';

export function textSegmentation(text: string, honorifics?: string[]): string {
  const options: tokenizer.Options = {
    newline_boundaries: true,
    html_boundaries: false,
    sanitize: false,
    allowed_tags: false,
    //TODO: Here could open HONORIFICS file and pass them in here I think
    //abbreviations: list of abbreviations to override the original ones for use with other languages. Don't put dots in abbreviations.
    abbreviations: honorifics,
  };

  const sentences = tokenizer.sentences(text, options);
  const sentencesWithLineSpaces = sentences.join('\n');

  return sentencesWithLineSpaces;
}
