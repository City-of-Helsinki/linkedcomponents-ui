import { Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { REGISTRATION_FIELDS } from '../../../constants';
import { registrationSchema } from '../../../validation';
import EnrolmentTimeSection from '../EnrolmentTimeSection';

configure({ defaultHidden: true });

type InitialValues = {
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME]: Date | null;
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME]: Date | null;
};

const defaultInitialValues: InitialValues = {
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME]: null,
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME]: null,
};

const renderComponent = (initialValues?: Partial<InitialValues>) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={registrationSchema}
    >
      <EnrolmentTimeSection />
    </Formik>
  );

afterAll(() => {
  clear();
});

const getElement = (key: 'endTime' | 'startTime') => {
  switch (key) {
    case 'endTime':
      return screen.getByRole('textbox', {
        name: /Ilmoittautuminen päättyy/i,
      });
    case 'startTime':
      return screen.getByRole('textbox', {
        name: /Ilmoittautuminen alkaa/i,
      });
  }
};

test('should validate enrolment start and end dates', async () => {
  advanceTo('2020-11-10');
  renderComponent();

  const startTime = '19.12.2021 12.15';
  const endTime = '18.12.2021 12.15';
  const startTimeInput = getElement('startTime');
  const endTimeInput = getElement('endTime');

  act(() => userEvent.click(startTimeInput));
  userEvent.type(startTimeInput, startTime);
  act(() => userEvent.click(endTimeInput));
  userEvent.type(endTimeInput, endTime);
  act(() => userEvent.click(startTimeInput));

  await waitFor(() => expect(startTimeInput).toHaveValue(startTime));
  await waitFor(() => expect(endTimeInput).toHaveValue(endTime));

  screen.getByText(`Tämän päivämäärän tulee olla vähintään ${startTime}`);
});
