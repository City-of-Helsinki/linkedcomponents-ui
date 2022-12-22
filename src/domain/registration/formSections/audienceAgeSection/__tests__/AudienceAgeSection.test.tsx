import { Formik } from 'formik';
import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { REGISTRATION_FIELDS } from '../../../constants';
import { registrationSchema } from '../../../validation';
import AudienceAgeSection from '../AudienceAgeSection';

configure({ defaultHidden: true });

type InitialValues = {
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: number | '';
  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: number | '';
};

const defaultInitialValues: InitialValues = {
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: '',
  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: '',
};

const renderComponent = (initialValues?: Partial<InitialValues>) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={registrationSchema}
    >
      <AudienceAgeSection isEditingAllowed={true} />
    </Formik>
  );

const getElement = (key: 'maxAge' | 'minAge') => {
  switch (key) {
    case 'maxAge':
      return screen.getByRole('spinbutton', { name: 'Yläikäraja' });
    case 'minAge':
      return screen.getByRole('spinbutton', { name: 'Alaikäraja' });
  }
};

test('should show validation error if max age is less than min age', async () => {
  const user = userEvent.setup();
  renderComponent({
    [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: 5,
    [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: 10,
  });

  const minAgeInput = getElement('minAge');
  const maxAgeInput = getElement('maxAge');

  await act(async () => await user.click(maxAgeInput));
  await act(async () => await user.click(minAgeInput));
  await act(async () => await user.tab());

  await screen.findByText('Arvon tulee olla vähintään 10');
});

test('should show validation error if min age is less than 0', async () => {
  const user = userEvent.setup();
  renderComponent({
    [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: -1,
  });

  const minAgeInput = getElement('minAge');
  const maxAgeInput = getElement('maxAge');

  await act(async () => await user.click(minAgeInput));
  await act(async () => await user.click(maxAgeInput));

  await screen.findByText('Arvon tulee olla vähintään 0');
});
