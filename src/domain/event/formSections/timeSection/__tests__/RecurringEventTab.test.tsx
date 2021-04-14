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
import { EVENT_TYPE } from '../../../constants';
import RecurringEventTab, {
  RecurringEventTabProps,
} from '../RecurringEventTab';

configure({ defaultHidden: true });

const defaultProps: RecurringEventTabProps = {
  eventType: EVENT_TYPE.EVENT,
  eventTimes: [],
  events: [],
  recurringEvents: [],
  setEventTimes: jest.fn(),
  setRecurringEvents: jest.fn(),
  setEvents: jest.fn(),
};

beforeEach(() => {
  clear();
});

const renderComponent = (props?: Partial<RecurringEventTabProps>) =>
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <RecurringEventTab {...defaultProps} {...props} />
    </Formik>
  );

const findElement = (
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
      return screen.findByRole('button', { name: /lisää toistuva tapahtuma/i });
    case 'endDate':
      return screen.findByRole('textbox', { name: /toisto päättyy/i });
    case 'endTime':
      return screen.findByRole('textbox', { name: /tapahtuma päättyy klo/i });
    case 'monCheckbox':
      return screen.findByRole('checkbox', { name: /ma/i });
    case 'startDate':
      return screen.findByRole('textbox', { name: /toisto alkaa/i });
    case 'startTime':
      return screen.findByRole('textbox', { name: /tapahtuma alkaa klo/i });
  }
};

test('should call setRecurringEvents', async () => {
  advanceTo('2021-04-12');
  const setRecurringEvents = jest.fn();
  renderComponent({ setRecurringEvents });
  const monCheckbox = await findElement('monCheckbox');
  const endDateInput = await findElement('endDate');
  const endTimeInput = await findElement('endTime');
  const startDateInput = await findElement('startDate');
  const startTimeInput = await findElement('startTime');

  userEvent.click(monCheckbox);

  userEvent.click(startDateInput);
  userEvent.type(startDateInput, '01.05.2021');

  userEvent.click(endDateInput);
  userEvent.type(endDateInput, '15.05.2021');

  userEvent.type(startTimeInput, '12.00');

  userEvent.type(endTimeInput, '15.00');

  const addButton = await findElement('addButton');
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
            endTime: new Date('2021-05-02T15:00:00.000Z'),
            id: null,

            startTime: new Date('2021-05-02T12:00:00.000Z'),
          },
          {
            endTime: new Date('2021-05-09T15:00:00.000Z'),
            id: null,
            startTime: new Date('2021-05-09T12:00:00.000Z'),
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
