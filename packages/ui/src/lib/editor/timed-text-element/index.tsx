import { chakra, Grid, GridItem, GridProps, Text } from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';
import { Editor, Element, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { useMediaPlayerContext } from '../../misc/media-player-context';
import { useTranscriptEditorContext } from '../../misc/transcript-editor-context';

export interface TimedTextElementProps {
  element: Element;
  attributes: GridProps;
  children: React.ReactNode;
  showSpeakers: boolean;
  showTimecodes: boolean;
}

export function TimedTextElement({
  showSpeakers,
  showTimecodes,
  ...props
}: TimedTextElementProps): JSX.Element {
  const { isEditable, handleAnalyticsEvents, editor } =
    useTranscriptEditorContext();
  const { handleTimedTextClick } = useMediaPlayerContext();

  const pathToCurrentNodeString = useMemo(
    () => JSON.stringify(ReactEditor.findPath(editor, props.element)),
    [editor, props.element]
  );

  /**
   * `handleSetSpeakerName` is outside of TimedTextElement
   * to improve the overall performance of the editor,
   * especially on long transcripts
   * @param {*} element - props.element, from `renderElement` function
   */
  const handleSetSpeakerName = useCallback(() => {
    if (isEditable) {
      const pathToCurrentNode = JSON.parse(pathToCurrentNodeString);
      const oldSpeakerName = props.element.speaker;

      const newSpeakerName = prompt('Change speaker name', oldSpeakerName);
      if (newSpeakerName) {
        const isUpdateAllSpeakerInstances = window.confirm(
          `Would you like to replace all occurrences of ${oldSpeakerName} with ${newSpeakerName}?`
        );

        // handles if set speaker name, and whether updates one or multiple
        handleAnalyticsEvents?.('ste_set_speaker_name', {
          fn: 'handleSetSpeakerName',
          changeSpeaker: true,
          updateMultiple: isUpdateAllSpeakerInstances,
        });

        if (isUpdateAllSpeakerInstances) {
          const rangeForTheWholeEditor = Editor.range(editor, []);
          // Apply transformation to the whole doc, where speaker matches old speaker name, and set it to new one
          Transforms.setNodes(
            editor,
            { type: 'timedText', speaker: newSpeakerName },
            {
              at: rangeForTheWholeEditor,
              match: (node: Node) => {
                return (
                  Element.isElement(node) &&
                  node.speaker.toLowerCase() === oldSpeakerName.toLowerCase()
                );
              },
            }
          );
        } else {
          // only apply speaker name transformation to current element
          Transforms.setNodes(
            editor,
            { type: 'timedText', speaker: newSpeakerName },
            { at: pathToCurrentNode }
          );
        }
      } else {
        // handles if click cancel and doesn't set speaker name
        handleAnalyticsEvents?.('ste_set_speaker_name', {
          fn: 'handleSetSpeakerName',
          changeSpeaker: false,
          updateMultiple: false,
        });
      }
    }
  }, [
    editor,
    handleAnalyticsEvents,
    isEditable,
    pathToCurrentNodeString,
    props.element.speaker,
  ]);

  let textColspan = 12;
  if (!showSpeakers && !showTimecodes) {
    textColspan = 12;
  } else if (showSpeakers && !showTimecodes) {
    textColspan = 11;
  } else if (!showSpeakers && showTimecodes) {
    textColspan = 10;
  } else if (showSpeakers && showTimecodes) {
    textColspan = 9;
  }

  return (
    <Grid
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      templateColumns="repeat(12, 1fr)"
      color={props.element.highlight ? 'black' : '#9e9e9e'}
      {...props.attributes}
    >
      {showTimecodes && (
        <GridItem contentEditable={false} colSpan={1}>
          <chakra.code
            contentEditable={false}
            userSelect="none"
            _hover={{
              textDecoration: 'underline',
            }}
            color="black"
            cursor="pointer"
            className={'timecode'}
            onClick={handleTimedTextClick}
            onDoubleClick={handleTimedTextClick}
            title={props.element.startTimecode}
            data-start={props.element.start}
          >
            {props.element.startTimecode}
          </chakra.code>
        </GridItem>
      )}
      {showSpeakers && (
        <GridItem contentEditable={false} colSpan={2}>
          <Text
            contentEditable={false}
            userSelect="none"
            cursor="pointer"
            width="100%"
            textTransform="uppercase"
            className={'text-truncate text-muted'}
            title={props.element.speaker}
            onClick={handleSetSpeakerName}
          >
            {props.element.speaker}
          </Text>
        </GridItem>
      )}
      <GridItem colSpan={textColspan}>{props.children}</GridItem>
    </Grid>
  );
}
