import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  EVENT_FIELDS,
  EVENT_INITIAL_VALUES,
  EVENT_TYPE,
} from '../../../constants';
import { EventFormFields } from '../../../types';
import { eventValidationSchema } from '../../../utils';
import VideoSection from '../VideoSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const defaultInitialValue = {
  [EVENT_FIELDS.TYPE]: type,
  [EVENT_FIELDS.VIDEOS]: EVENT_INITIAL_VALUES.videos,
};

const renderVideoSection = (initialValues?: Partial<EventFormFields>) =>
  render(
    <Formik
      initialValues={{
        ...defaultInitialValue,
        ...initialValues,
      }}
      onSubmit={jest.fn()}
      validationSchema={eventValidationSchema}
    >
      <VideoSection />
    </Formik>
  );

test('should render VideoSection', () => {
  renderVideoSection();

  const headings = [
    translations.event.form.titleVideo[type],
    translations.event.form.notificationTitleVideo[type],
  ];
  headings.forEach((name) => {
    screen.getByRole('heading', { name });
  });

  const texts = [
    translations.event.form.infoTextVideo1[type],
    translations.event.form.infoTextVideo2,
  ];

  texts.forEach((text) => {
    screen.getByText(text);
  });

  const fields = [
    translations.event.form.labelVideoAltText,
    translations.event.form.labelVideoName,
    translations.event.form.labelVideoUrl,
  ];

  fields.forEach((name) => {
    screen.getByRole('textbox', { name });
  });

  screen.getByRole('button', { name: translations.event.form.buttonAddVideo });
});

test('fields should be set required if any field is not empty', async () => {
  renderVideoSection();

  const nameInput = screen.getByRole('textbox', {
    name: translations.event.form.labelVideoName,
  });
  const altTextInput = screen.getByRole('textbox', {
    name: translations.event.form.labelVideoAltText,
  });
  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.labelVideoUrl,
  });
  const inputs = [nameInput, altTextInput, urlInput];

  for (const input of inputs) {
    userEvent.type(input, 'text');

    for (const field of inputs) {
      await waitFor(() => {
        expect((field as HTMLInputElement).required).toBe(true);
      });
    }

    userEvent.clear(input);

    for (const field of inputs) {
      await waitFor(() => {
        expect((field as HTMLInputElement).required).toBeFalsy();
      });
    }
  }
});

test('should add and remove video', async () => {
  renderVideoSection();

  const fields = [
    translations.event.form.labelVideoAltText,
    translations.event.form.labelVideoName,
    translations.event.form.labelVideoUrl,
  ];

  fields.forEach((name) => {
    expect(screen.getAllByRole('textbox', { name })).toHaveLength(1);
  });

  const addButton = screen.getByRole('button', {
    name: translations.event.form.buttonAddVideo,
  });
  userEvent.click(addButton);

  fields.forEach((name) => {
    expect(screen.getAllByRole('textbox', { name })).toHaveLength(2);
  });

  const deleteButton = screen.getAllByRole('button', {
    name: translations.event.form.buttonDeleteVideo,
  })[1];
  userEvent.click(deleteButton);

  fields.forEach((name) => {
    expect(screen.getAllByRole('textbox', { name })).toHaveLength(1);
  });
});
