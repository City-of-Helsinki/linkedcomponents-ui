import React from 'react';
import { vi } from 'vitest';

import {
  configure,
  render,
  screen,
  userEvent,
  within,
} from '../../../../../../utils/testUtils';
import { RecurringEventSettings } from '../../../../types';
import {
  TimeSectionContext,
  timeSectionContextDefaultValue,
  TimeSectionContextProps,
} from '../../TimeSectionContext';
import RecurringEvents from '../RecurringEvents';

configure({ defaultHidden: true });

const renderComponent = (context?: Partial<TimeSectionContextProps>) =>
  render(
    <TimeSectionContext.Provider
      value={{ ...timeSectionContextDefaultValue, ...context }}
    >
      <RecurringEvents />
    </TimeSectionContext.Provider>
  );

const recurringEvent1: RecurringEventSettings = {
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

const recurringEvent2: RecurringEventSettings = {
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
  const user = userEvent.setup();

  renderComponent({ recurringEvents });

  const toggleButton1 = screen.getByRole('button', {
    name: 'Ma, Viikon välein, 1.5.2021 – 15.5.2021',
  });
  await user.click(toggleButton1);

  screen.getByRole('row', {
    name: '1 2.5.2021 12.00 – 2.5.2021 15.00',
    hidden: false,
  });
  screen.getByRole('row', {
    name: '2 9.5.2021 12.00 – 9.5.2021 15.00',
    hidden: false,
  });

  const toggleButton2 = screen.getByRole('button', {
    name: 'Ma ja Ke, Viikon välein, 1.6.2021 – 15.6.2021',
  });
  await user.click(toggleButton2);

  screen.getByRole('row', {
    name: '3 2.6.2021 12.00 – 2.6.2021 15.00',
    hidden: false,
  });
  screen.getByRole('row', {
    name: '4 9.6.2021 12.00 – 9.6.2021 15.00',
    hidden: false,
  });
});

test('should call setRecurringEvents when deleting a single event time', async () => {
  const recurringEvents = [recurringEvent1, recurringEvent2];
  const setRecurringEvents = vi.fn();
  const user = userEvent.setup();

  renderComponent({ recurringEvents, setRecurringEvents });

  const toggleButton = screen.getByRole('button', {
    name: 'Ma, Viikon välein, 1.5.2021 – 15.5.2021',
  });
  await user.click(toggleButton);

  const withinEventRow = within(
    screen.getByRole('row', {
      name: '1 2.5.2021 12.00 – 2.5.2021 15.00',
    })
  );
  const toggleMenuButton = withinEventRow.getByRole('button', {
    name: 'Valinnat',
  });
  await user.click(toggleMenuButton);

  const deleteButton = withinEventRow.getByRole('button', { name: 'Poista' });
  await user.click(deleteButton);

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
