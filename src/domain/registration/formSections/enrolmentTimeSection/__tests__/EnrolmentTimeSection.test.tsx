import { Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
  within,
} from '../../../../../utils/testUtils';
import { REGISTRATION_FIELDS } from '../../../constants';
import { registrationSchema } from '../../../validation';
import EnrolmentTimeSection from '../EnrolmentTimeSection';

configure({ defaultHidden: true });

type InitialValues = {
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE]: Date | null;
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME]: string;
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE]: Date | null;
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME]: string;
};

const defaultInitialValues: InitialValues = {
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE]: null,
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME]: '',
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE]: null,
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME]: '',
};

const renderComponent = (initialValues?: Partial<InitialValues>) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={registrationSchema}
    >
      <EnrolmentTimeSection isEditingAllowed={true} />
    </Formik>
  );

afterAll(() => {
  clear();
});

const getElement = (key: 'endDate' | 'endTime' | 'startDate' | 'startTime') => {
  switch (key) {
    case 'endDate':
      return screen.getByLabelText('Ilmoittautuminen päättyy *');
    case 'endTime':
      const endTimeGroup = screen.getByRole('group', {
        name: 'Ilmoittautuminen päättyy klo',
      });
      return within(endTimeGroup).getByLabelText('tunnit');
    case 'startDate':
      return screen.getByLabelText('Ilmoittautuminen alkaa *');
    case 'startTime':
      const startTimeGroup = screen.getByRole('group', {
        name: 'Ilmoittautuminen alkaa klo',
      });
      return within(startTimeGroup).getByLabelText('tunnit');
  }
};

test('should validate enrolment start and end dates', async () => {
  advanceTo('2020-11-10');
  const user = userEvent.setup();
  renderComponent();

  const startDate = '19.12.2021';
  const startTime = '12:15';
  const endDate = '18.12.2021';
  const endTime = '12:15';

  const startDateInput = getElement('startDate');
  const startTimeInput = getElement('startTime');
  const endDateInput = getElement('endDate');
  const endTimeInput = getElement('endTime');

  await user.click(startDateInput);
  await user.type(startDateInput, startDate);
  await user.click(startTimeInput);
  await user.type(startTimeInput, startTime);

  await user.click(endDateInput);
  await user.type(endDateInput, endDate);
  await user.click(endTimeInput);
  await user.type(endTimeInput, endTime);
  await user.click(startDateInput);

  await screen.findByText(
    'Tämän päivämäärän tulee olla 19.12.2021 12.15 jälkeen'
  );
});
