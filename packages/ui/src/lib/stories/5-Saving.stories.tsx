import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/react';
import { ComponentProps } from 'react';
import DEMO_SOLEIO from '../../../sample-data/soleio-dpe.json';
import { DefaultLayout } from '../default-layout';

export default {
  title: 'Saving indicator',
  component: DefaultLayout,
  argTypes: {
    autoSaveContentType: {
      options: ['digitalpaperedit', 'slate'],
      control: { type: 'radio' },
    },
    mediaType: {
      options: ['audio', 'video'],
      control: { type: 'radio' },
    },
  },
};

const Template: Story<ComponentProps<typeof DefaultLayout>> = (args) => (
  <DefaultLayout {...args} />
);

const DEMO_MEDIA_URL_SOLEIO =
  'https://digital-paper-edit-demo.s3.eu-west-2.amazonaws.com/PBS-Frontline/The+Facebook+Dilemma+-+interviews/The+Facebook+Dilemma+-+Soleio+Cuervo-OIAUfZBd_7w.mp4';
const DEMO_TITLE_SOLEIO = 'Soleio Interview, PBS Frontline';

export const NoAutoSave = Template.bind({});
NoAutoSave.args = {
  title: DEMO_TITLE_SOLEIO,
  mediaUrl: DEMO_MEDIA_URL_SOLEIO,
  handleSaveEditor: action('handleSaveEditor'),
  autoSaveContentType: 'digitalpaperedit', // digitalpaperedit or slate - digitalpaperedit, runs alignement before exporting, slate, is just the raw data.
  transcriptData: DEMO_SOLEIO,
};

export const AutoSave = Template.bind({});
AutoSave.args = {
  title: DEMO_TITLE_SOLEIO,
  mediaUrl: DEMO_MEDIA_URL_SOLEIO,
  handleSaveEditor: action('handleSaveEditor'),
  handleAutoSaveChanges: action('handleAutoSaveChanges'),
  autoSaveContentType: 'digitalpaperedit', // digitalpaperedit or slate - digitalpaperedit, runs alignement before exporting, slate, is just the raw data.
  transcriptData: DEMO_SOLEIO,
};
