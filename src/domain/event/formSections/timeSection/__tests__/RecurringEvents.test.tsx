import { clear } from 'jest-date-mock';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import RecurringEvents from '../RecurringEvents';
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
    <TimeSectionContext.Provider
      value={{ ...timeSectionContextDefaultValue, ...context }}
    >
      <RecurringEvents />
    </TimeSectionContext.Provider>
  );

const recurringEvent1 = {
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
};
const recurringEvent2 = {
  endDate: new Date('2021-06-15T00:00:00.000Z'),
  endTime: '15.00',
  eventTimes: [
    {
      endTime: new Date('2021-06-02T15:00:00.000Z'),
      id: null,

      startTime: new Date('2021-06-02T12:00:00.000Z'),
    },
    {
      endTime: new Date('2021-06-09T15:00:00.000Z'),
      id: null,
      startTime: new Date('2021-06-09T12:00:00.000Z'),
    },
  ],
  repeatDays: ['mon', 'wed'],
  repeatInterval: 1,
  startDate: new Date('2021-06-01T00:00:00.000Z'),
  startTime: '12.00',
};

test('should render component', async () => {
  const recurringEvents = [recurringEvent1, recurringEvent2];
  renderComponent({ recurringEvents });
  const toggleButton1 = screen.getByRole('button', {
    name: 'Ma, Viikon välein, 01.05.2021 – 15.05.2021',
  });
  userEvent.click(toggleButton1);
  screen.getByRole('row', {
    name: '1 02.05.2021 12.00 – 02.05.2021 15.00',
    hidden: false,
  });
  screen.getByRole('row', {
    name: '2 09.05.2021 12.00 – 09.05.2021 15.00',
    hidden: false,
  });

  const toggleButton2 = screen.getByRole('button', {
    name: 'Ma ja Ke, Viikon välein, 01.06.2021 – 15.06.2021',
  });
  userEvent.click(toggleButton2);
  screen.getByRole('row', {
    name: '3 02.06.2021 12.00 – 02.06.2021 15.00',
    hidden: false,
  });
  screen.getByRole('row', {
    name: '4 09.06.2021 12.00 – 09.06.2021 15.00',
    hidden: false,
  });
});

test('should call setRecurringEvents when deleting a single event time', async () => {
  const recurringEvents = [recurringEvent1, recurringEvent2];
  const setRecurringEvents = jest.fn();

  renderComponent({ recurringEvents, setRecurringEvents });

  const toggleButton1 = screen.getByRole('button', {
    name: 'Ma, Viikon välein, 01.05.2021 – 15.05.2021',
  });
  userEvent.click(toggleButton1);
  const toggleMenuButton = screen.getAllByRole('button', {
    name: 'Valinnat',
  })[0];
  userEvent.click(toggleMenuButton);

  const deleteButton = screen.getByRole('button', {
    name: 'Poista',
  });
  userEvent.click(deleteButton);

  expect(setRecurringEvents).toBeCalledWith([
    {
      ...recurringEvent1,
      eventTimes: [
        {
          endTime: new Date('2021-05-09T15:00:00.000Z'),
          id: null,
          startTime: new Date('2021-05-09T12:00:00.000Z'),
        },
      ],
    },
    recurringEvent2,
  ]);
});
