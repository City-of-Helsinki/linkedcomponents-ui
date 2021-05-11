import { Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { eventValidationSchema } from '../../../utils';
import AdditionalInfoSection from '../AdditionalInfoSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const initialValues = {
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: '',
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: '',
  [EVENT_FIELDS.ENROLMENT_END_TIME]: null,
  [EVENT_FIELDS.ENROLMENT_START_TIME]: null,
  [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: '',
  [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: '',
  [EVENT_FIELDS.TYPE]: type,
};

const renderComponent = () =>
  render(
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={eventValidationSchema}
    >
      <AdditionalInfoSection />
    </Formik>
  );

afterAll(() => {
  clear();
});

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

  const spinbuttons = [
    translations.event.form.labelAudienceMinAge,
    translations.event.form.labelAudienceMaxAge,
    translations.event.form.extensionCourse.labelMinimimAttendeeCapacity,
    translations.event.form.extensionCourse.labelMaximumAttendeeCapacity,
  ];

  spinbuttons.forEach((label) => {
    // Notification has same heading so test that length is 2
    screen.getByRole('spinbutton', { name: label });
  });

  const textboxs = [
    translations.event.form.extensionCourse.labelEnrolmentStartTime,
    translations.event.form.extensionCourse.labelEnrolmentEndTime,
  ];

  textboxs.forEach((label) => {
    screen.getByRole('textbox', { name: label });
  });
});

test('should validate min and max audience ages', async () => {
  renderComponent();

  const minAgeInput = screen.getByRole('spinbutton', {
    name: translations.event.form.labelAudienceMinAge,
  });
  const maxAgeInput = screen.getByRole('spinbutton', {
    name: translations.event.form.labelAudienceMaxAge,
  });

  userEvent.type(minAgeInput, '10');
  userEvent.type(maxAgeInput, '5');

  await waitFor(() => expect(minAgeInput).toHaveValue(10));
  await waitFor(() => expect(maxAgeInput).toHaveValue(5));
  userEvent.tab();

  screen.getByText('Arvon tulee olla vähintään 10');
});

test('should validate enrolment start and end dates', async () => {
  advanceTo('2020-11-10');
  renderComponent();

  const startTime = '19.12.2021 12.15';
  const endTime = '18.12.2021 12.15';
  const startTimeInput = screen.getByRole('textbox', {
    name: translations.event.form.extensionCourse.labelEnrolmentStartTime,
  });
  const endTimeInput = screen.getByRole('textbox', {
    name: translations.event.form.extensionCourse.labelEnrolmentEndTime,
  });

  userEvent.click(startTimeInput);
  userEvent.type(startTimeInput, startTime);
  userEvent.click(endTimeInput);
  userEvent.type(endTimeInput, endTime);
  userEvent.click(startTimeInput);

  await waitFor(() => expect(startTimeInput).toHaveValue(startTime));
  await waitFor(() => expect(endTimeInput).toHaveValue(endTime));

  screen.getByText(`Tämän päivämäärän tulee olla vähintään ${startTime}`);
});

test('should validate min and max attendee capacities', async () => {
  renderComponent();

  const minCapacityInput = screen.getByRole('spinbutton', {
    name: translations.event.form.extensionCourse.labelMinimimAttendeeCapacity,
  });
  const maxCapacityInput = screen.getByRole('spinbutton', {
    name: translations.event.form.extensionCourse.labelMaximumAttendeeCapacity,
  });

  userEvent.type(minCapacityInput, '10');
  userEvent.type(maxCapacityInput, '5');
  userEvent.tab();
  await waitFor(() => expect(minCapacityInput).toHaveValue(10));
  await waitFor(() => expect(maxCapacityInput).toHaveValue(5));

  screen.getByText('Arvon tulee olla vähintään 10');
});
