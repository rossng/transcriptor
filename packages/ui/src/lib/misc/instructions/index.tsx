import {
  Button,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  MdFileDownload,
  MdHelp,
  MdKeyboard,
  MdKeyboardReturn,
  MdMouse,
  MdPeople,
  MdSave,
} from 'react-icons/md';
import { useTranscriptEditorContext } from '../transcript-editor-context';

export function Instructions(): JSX.Element {
  const context = useTranscriptEditorContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>
        <MdHelp size={24} color="primary" aria-hidden />
        <Text ml={2}>How does this work?</Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Help</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {!context.isEditable && <Text>You are in read only mode.</Text>}
            {context.isEditable && (
              <List>
                <ListItem>
                  <ListIcon as={MdMouse} />
                  Double click on a word or time stamp to jump to the
                  corresponding point in the media.
                </ListItem>
                <ListItem>
                  <ListIcon as={MdKeyboard} />
                  Start typing to edit text.
                </ListItem>
                <ListItem>
                  <ListIcon as={MdPeople} />
                  You can add and change names of speakers in your transcript.
                </ListItem>
                <ListItem>
                  <ListIcon as={MdKeyboardReturn} />
                  Hit enter in between words to split a paragraph.
                </ListItem>
                <ListItem>
                  <ListIcon as={MdSave} />
                  Remember to save regularly.
                </ListItem>
                <ListItem>
                  <ListIcon as={MdFileDownload} />
                  Export to get a copy.
                </ListItem>
              </List>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
