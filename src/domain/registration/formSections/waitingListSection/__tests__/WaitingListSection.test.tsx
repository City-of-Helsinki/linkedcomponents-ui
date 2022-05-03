import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { REGISTRATION_FIELDS } from '../../../constants';
import { registrationSchema } from '../../../validation';
import WaitingListSection from '../WaitingListSection';

configure({ defaultHidden: true });

type InitialValues = {
  [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: number | '';
};

const defaultInitialValues: InitialValues = {
  [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: '',
};

const renderComponent = (initialValues?: Partial<InitialValues>) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={registrationSchema}
    >
      <WaitingListSection isEditingAllowed={true} />
    </Formik>
  );

const getElement = (key: 'waitingCapacity') => {
  switch (key) {
    case 'waitingCapacity':
      return screen.getByRole('spinbutton', {
        name: translations.registration.form.labelWaitingListCapacity,
      });
  }
};

test('should show validation error if waiting attendee capacity is less than 0', async () => {
  renderComponent({
    [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: -1,
  });

  const waitingCapacityInput = getElement('waitingCapacity');

  userEvent.click(waitingCapacityInput);
  userEvent.tab();

  await screen.findByText('Arvon tulee olla vähintään 0');
});
