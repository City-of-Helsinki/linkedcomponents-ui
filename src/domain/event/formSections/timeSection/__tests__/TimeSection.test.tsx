import { Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { createValidationSchema } from '../../../utils';
import TimeSection from '../TimeSection';

const type = EVENT_TYPE.EVENT;

const renderTimeSection = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.END_TIME]: null,
        [EVENT_FIELDS.EVENT_TIMES]: [],
        [EVENT_FIELDS.START_TIME]: null,
        [EVENT_FIELDS.TYPE]: type,
      }}
      onSubmit={jest.fn()}
      validationSchema={createValidationSchema()}
    >
      <TimeSection />
    </Formik>
  );

afterAll(() => {
  clear();
});

test('should render TimeSection', () => {
  renderTimeSection();

  //  Notification title is same as section title
  expect(
    screen.queryAllByRole('heading', {
      name: translations.event.form.titleTime[type],
    })
  ).toHaveLength(2);

  const texts = [
    translations.event.form.infoTextEventTimes1[type],
    translations.event.form.infoTextEventTimes2[type],
    translations.event.form.infoTextEventTimes3[type],
    translations.event.form.infoTextEventTimes4[type],
    translations.event.form.infoTextEventTimes5[type],
  ];

  texts.forEach((text) => {
    expect(screen.queryByText(text)).toBeInTheDocument();
  });

  const fields = [
    translations.event.form.labelStartTime[type],
    translations.event.form.labelEndTime[type],
  ];

  fields.forEach((name) => {
    screen.queryByRole('textbox', { name });
  });

  // TODO: Add also "Avaa toistuvan tapahtuman asetukset" button to this array when implemented
  const buttons = [translations.event.form.buttonAddEventTime];

  buttons.forEach((name) => {
    screen.queryByRole('button', { name });
  });
});

test('should show error message when end time is before start time', async () => {
  advanceTo('2020-11-04');
  renderTimeSection();

  const startTime = '07.11.2020 15.00';
  const endTime = '07.11.2020 12.00';
  const startInput = screen.getByRole('textbox', {
    name: translations.event.form.labelStartTime[type],
  });
  const endInput = screen.getByRole('textbox', {
    name: translations.event.form.labelEndTime[type],
  });

  userEvent.click(startInput);
  userEvent.type(startInput, startTime);
  userEvent.click(endInput);

  expect(startInput).toHaveValue(startTime);

  userEvent.type(endInput, endTime);
  userEvent.tab();

  expect(endInput).toHaveValue(endTime);

  await waitFor(() => {
    expect(
      screen.queryByText(
        translations.form.validation.date.min.replace('{{min}}', startTime)
      )
    ).toBeInTheDocument();
  });
});

test('should add and delete event time', async () => {
  renderTimeSection();
  const startTimeName = translations.event.form.labelStartTime[type];
  const endTimeName = translations.event.form.labelEndTime[type];

  expect(screen.getAllByRole('textbox', { name: startTimeName })).toHaveLength(
    1
  );
  expect(screen.getAllByRole('textbox', { name: endTimeName })).toHaveLength(1);

  const addButton = screen.getByRole('button', {
    name: translations.event.form.buttonAddEventTime,
  });
  userEvent.click(addButton);

  expect(screen.getAllByRole('textbox', { name: startTimeName })).toHaveLength(
    2
  );
  expect(screen.getAllByRole('textbox', { name: endTimeName })).toHaveLength(2);

  const deleteButton = screen.getByRole('button', {
    name: translations.event.form.buttonDeleteEventTime,
  });
  userEvent.click(deleteButton);

  expect(screen.getAllByRole('textbox', { name: startTimeName })).toHaveLength(
    1
  );
  expect(screen.getAllByRole('textbox', { name: endTimeName })).toHaveLength(1);
});
