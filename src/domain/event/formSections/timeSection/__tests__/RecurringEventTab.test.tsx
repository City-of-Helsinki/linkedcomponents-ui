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
import RecurringEventTab from '../RecurringEventTab';
import TimeSectionContext, {
  timeSectionContextDefaultValue,
  TimeSectionContextProps,
} from '../TimeSectionContext';

configure({ defaultHidden: true });

beforeEach(() => {
  clear();
});

const renderComponent = (context?: Partial<TimeSectionContextProps>) =>
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <TimeSectionContext.Provider
        value={{ ...timeSectionContextDefaultValue, ...context }}
      >
        <RecurringEventTab />
      </TimeSectionContext.Provider>
    </Formik>
  );

const getElement = (
  key:
    | 'addButton'
    | 'endDate'
    | 'endTime'
    | 'monCheckbox'
    | 'startDate'
    | 'startTime'
) => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: /lisää toistuva tapahtuma/i });
    case 'endDate':
      return screen.getByRole('textbox', { name: /toisto päättyy/i });
    case 'endTime':
      return screen.getByRole('textbox', { name: /tapahtuma päättyy klo/i });
    case 'monCheckbox':
      return screen.getByRole('checkbox', { name: /ma/i });
    case 'startDate':
      return screen.getByRole('textbox', { name: /toisto alkaa/i });
    case 'startTime':
      return screen.getByRole('textbox', { name: /tapahtuma alkaa klo/i });
  }
};

test('should call setRecurringEvents', async () => {
  advanceTo('2021-04-12');
  const setRecurringEvents = jest.fn();
  renderComponent({ setRecurringEvents });
  const monCheckbox = getElement('monCheckbox');
  const endDateInput = getElement('endDate');
  const endTimeInput = getElement('endTime');
  const startDateInput = getElement('startDate');
  const startTimeInput = getElement('startTime');

  userEvent.click(monCheckbox);

  userEvent.click(startDateInput);
  userEvent.type(startDateInput, '01.05.2021');

  userEvent.click(endDateInput);
  userEvent.type(endDateInput, '15.05.2021');

  userEvent.type(startTimeInput, '12.00');

  userEvent.type(endTimeInput, '15.00');

  const addButton = getElement('addButton');
  await waitFor(() => {
    expect(addButton).toBeEnabled();
  });
  userEvent.click(addButton);

  await waitFor(() => {
    expect(setRecurringEvents).toBeCalledWith([
      {
        endDate: new Date('2021-05-15T00:00:00.000Z'),
        endTime: '15.00',
        eventTimes: [
          {
            endTime: new Date('2021-05-03T15:00:00.000Z'),
            id: null,

            startTime: new Date('2021-05-03T12:00:00.000Z'),
          },
          {
            endTime: new Date('2021-05-10T15:00:00.000Z'),
            id: null,
            startTime: new Date('2021-05-10T12:00:00.000Z'),
          },
        ],
        repeatDays: ['mon'],
        repeatInterval: 1,
        startDate: new Date('2021-05-01T00:00:00.000Z'),
        startTime: '12.00',
      },
    ]);
  });
});
