import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import {
  EVENT_FIELDS,
  EVENT_INITIAL_VALUES,
  EVENT_TYPE,
} from '../../../constants';
import { EventFormFields } from '../../../types';
import { publicEventSchema } from '../../../validation';
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
      onSubmit={vi.fn()}
      validationSchema={publicEventSchema}
    >
      <VideoSection isEditingAllowed={true} />
    </Formik>
  );

const getElement = (
  key: 'addButton' | 'altTextInput' | 'nameInput' | 'urlInput'
) => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: 'Lisää video' });
    case 'altTextInput':
      return screen.getByLabelText('Videon alt-teksti');
    case 'nameInput':
      return screen.getByLabelText('Videon nimi');
    case 'urlInput':
      return screen.getByLabelText('Videon URL-osoite');
  }
};

const getElements = (key: 'deleteButtons') => {
  switch (key) {
    case 'deleteButtons':
      return screen.getAllByRole('button', { name: 'Poista video' });
  }
};

test('should render VideoSection', () => {
  renderVideoSection();

  // Section title and notification title are same
  expect(
    screen.getAllByRole('heading', { name: 'Tapahtuman video' })
  ).toHaveLength(2);

  const texts = [
    'Jos tapahtumaan liittyy video, voit lisätä sen osoitteen tässä.',
    'Anna videolle nimi ja kuvaa lyhyesti mitä siinä tapahtuu.',
  ];

  texts.forEach((text) => screen.getByText(text));

  getElement('nameInput');
  getElement('altTextInput');
  getElement('urlInput');

  getElement('addButton');
});

test('fields should be set required if any field is not empty', async () => {
  const user = userEvent.setup();
  renderVideoSection();

  const nameInput = getElement('nameInput');
  const altTextInput = getElement('altTextInput');
  const urlInput = getElement('urlInput');
  const inputs = [nameInput, altTextInput, urlInput];

  for (const input of inputs) {
    await user.type(input, 'text');

    for (const field of inputs) {
      await waitFor(() =>
        expect((field as HTMLInputElement).required).toBe(true)
      );
    }

    await user.clear(input);

    for (const field of inputs) {
      await waitFor(() =>
        expect((field as HTMLInputElement).required).toBeFalsy()
      );
    }
  }
});

test('should add and remove video', async () => {
  const user = userEvent.setup();
  renderVideoSection();

  const fields = ['Videon nimi'];

  fields.forEach((name) => {
    expect(screen.getAllByLabelText(name)).toHaveLength(1);
  });

  const addButton = getElement('addButton');
  await user.click(addButton);

  await waitFor(() =>
    expect(screen.getAllByLabelText(fields[0])).toHaveLength(2)
  );

  const deleteButton = getElements('deleteButtons')[1];
  await user.click(deleteButton);

  await waitFor(() =>
    expect(screen.getAllByLabelText(fields[0])).toHaveLength(1)
  );
});
