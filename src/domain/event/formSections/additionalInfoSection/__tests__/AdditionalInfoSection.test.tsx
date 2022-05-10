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
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { publicEventSchema } from '../../../utils';
import AdditionalInfoSection from '../AdditionalInfoSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

type InitialValues = {
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: number | '';
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: number | '';
  [EVENT_FIELDS.ENROLMENT_END_TIME]: Date | null;
  [EVENT_FIELDS.ENROLMENT_START_TIME]: Date | null;
  [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: number | '';
  [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: number | '';
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: '',
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: '',
  [EVENT_FIELDS.ENROLMENT_END_TIME]: null,
  [EVENT_FIELDS.ENROLMENT_START_TIME]: null,
  [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: '',
  [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: '',
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
      <AdditionalInfoSection isEditingAllowed={true} />
    </Formik>
  );

afterAll(() => {
  clear();
});

const getElement = (
  key:
    | 'endTime'
    | 'maxAge'
    | 'minAge'
    | 'maxCapacity'
    | 'minCapacity'
    | 'startTime'
) => {
  switch (key) {
    case 'endTime':
      return screen.getByRole('textbox', { name: 'Ilmoittautuminen päättyy' });
    case 'maxAge':
      return screen.getByRole('spinbutton', { name: 'Yläikäraja' });
    case 'minAge':
      return screen.getByRole('spinbutton', { name: 'Alaikäraja' });
    case 'maxCapacity':
      return screen.getByRole('spinbutton', {
        name: 'Vähimmäisosallistujamäärä',
      });
    case 'minCapacity':
      return screen.getByRole('spinbutton', {
        name: 'Enimmäisosallistujamäärä',
      });
    case 'startTime':
      return screen.getByRole('textbox', { name: 'Ilmoittautuminen alkaa' });
  }
};

test('should render additional info section', async () => {
  renderComponent();

  const headings = [
    translations.event.form.titleAudienceAge,
    translations.event.form.titleEnrolmentTime,
    translations.event.form.titleAttendeeCapacity,
  ];

  headings.forEach((heading) => {
    // Notification has same heading so test that length is 2
    expect(screen.getAllByRole('heading', { name: heading })).toHaveLength(2);
  });

  getElement('minAge');
  getElement('maxAge');
  getElement('minCapacity');
  getElement('maxCapacity');
  getElement('startTime');
  getElement('endTime');
});

test('should show validation error if max age is less than min age', async () => {
  const user = userEvent.setup();
  renderComponent({
    [EVENT_FIELDS.AUDIENCE_MAX_AGE]: 5,
    [EVENT_FIELDS.AUDIENCE_MIN_AGE]: 10,
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
    [EVENT_FIELDS.AUDIENCE_MIN_AGE]: -1,
  });

  const minAgeInput = getElement('minAge');
  const maxAgeInput = getElement('maxAge');

  await act(async () => await user.click(minAgeInput));
  await act(async () => await user.click(maxAgeInput));

  await screen.findByText('Arvon tulee olla vähintään 0');
});

test('should validate enrolment start and end dates', async () => {
  advanceTo('2020-11-10');
  const user = userEvent.setup();
  renderComponent();

  const startTime = '19.12.2021 12.15';
  const endTime = '18.12.2021 12.15';
  const startTimeInput = getElement('startTime');
  const endTimeInput = getElement('endTime');

  await act(async () => await user.click(startTimeInput));
  user.type(startTimeInput, startTime);
  await waitFor(() => expect(startTimeInput).toHaveValue(startTime), {
    timeout: 10000,
  });
  await act(async () => await user.click(endTimeInput));
  user.type(endTimeInput, endTime);
  await waitFor(() => expect(endTimeInput).toHaveValue(endTime), {
    timeout: 5000,
  });
  await act(async () => await user.click(startTimeInput));

  screen.getByText(`Tämän päivämäärän tulee olla vähintään ${startTime}`);
});

test('should show validation error if max capacity is less than min capacity', async () => {
  const user = userEvent.setup();
  renderComponent({
    [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: 5,
    [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: 10,
  });

  const minCapacityInput = getElement('minCapacity');
  const maxCapacityInput = getElement('maxCapacity');

  await act(async () => await user.click(maxCapacityInput));
  await act(async () => await user.click(minCapacityInput));
  await act(async () => await user.tab());

  await screen.findByText('Arvon tulee olla vähintään 10');
});

test('should show validation error if min attendee capacity is less than 0', async () => {
  const user = userEvent.setup();
  renderComponent({
    [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: -1,
  });

  const minCapacityInput = getElement('minCapacity');
  const maxCapacityInput = getElement('maxCapacity');

  await act(async () => await user.click(maxCapacityInput));
  await act(async () => await user.click(minCapacityInput));

  await screen.findByText('Arvon tulee olla vähintään 0');
});
