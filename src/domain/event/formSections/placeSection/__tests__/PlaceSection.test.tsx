import { Formik } from 'formik';
import React from 'react';

import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  LE_DATA_LANGUAGES,
} from '../../../../../constants';
import { MultiLanguageObject } from '../../../../../types';
import {
  configure,
  mockString,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { publicEventSchema } from '../../../utils';
import PlaceSection from '../PlaceSection';

configure({ defaultHidden: true });

const languages: LE_DATA_LANGUAGES[] = [LE_DATA_LANGUAGES.FI];
const type = EVENT_TYPE.General;

type InitialValues = {
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: LE_DATA_LANGUAGES[];
  [EVENT_FIELDS.LOCATION]: string | null;
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: MultiLanguageObject;
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: languages,
  [EVENT_FIELDS.LOCATION]: null,
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [EVENT_FIELDS.TYPE]: type,
};

const renderComponent = (initialValues?: Partial<InitialValues>) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={publicEventSchema}
    >
      <PlaceSection />
    </Formik>
  );

const getElement = (key: 'location' | 'locationExtraInfo') => {
  switch (key) {
    case 'location':
      return screen.getByRole('combobox', { name: /paikka/i });
    case 'locationExtraInfo':
      return screen.getByPlaceholderText(
        /syötä lisätietoja tapahtumapaikasta/i
      );
  }
};

test('should show validation error if location is missing', async () => {
  renderComponent();

  const locationCombobox = getElement('location');
  const locationExtraInfoInput = getElement('locationExtraInfo');

  userEvent.click(locationCombobox);
  userEvent.click(locationExtraInfoInput);

  await screen.findByText('Tämä kenttä on pakollinen');
});

test('should show validation error if location extra info is too long', async () => {
  renderComponent({
    [EVENT_FIELDS.LOCATION_EXTRA_INFO]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: mockString(161),
    },
  });

  const locationExtraInfoInput = getElement('locationExtraInfo');
  const locationCombobox = getElement('location');

  userEvent.click(locationExtraInfoInput);
  userEvent.click(locationCombobox);

  await screen.findByText('Tämä kenttä voi olla korkeintaan 160 merkkiä pitkä');
});
