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
import EventTimesTable, { EventTimesTableProps } from '../EventTimesTable';

configure({ defaultHidden: true });

const defaultProps: EventTimesTableProps = {
  eventTimes: [],
  setEventTimes: jest.fn(),
};

beforeEach(() => {
  clear();
});

const eventTime1 = {
  endTime: new Date('2021-05-02T15:00:00.000Z'),
  id: null,
  startTime: new Date('2021-05-02T12:00:00.000Z'),
};
const eventTime2 = {
  endTime: new Date('2021-05-03T15:00:00.000Z'),
  id: null,
  startTime: new Date('2021-05-03T12:00:00.000Z'),
};

const renderComponent = (props?: Partial<EventTimesTableProps>) =>
  render(<EventTimesTable {...defaultProps} {...props} />);

test('should not show event times table if eventTimes is empty', async () => {
  renderComponent({ eventTimes: [] });

  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('should render event times table', async () => {
  advanceTo('2021-04-12');
  const eventTimes = [eventTime1, eventTime2];

  renderComponent({ eventTimes });

  screen.getByRole('table');
  screen.getByRole('row', { name: '1 02.05.2021 12.00 – 02.05.2021 15.00' });
  screen.getByRole('row', { name: '2 03.05.2021 12.00 – 03.05.2021 15.00' });
});

test('should call setEventTimes when deleting an event time', async () => {
  advanceTo('2021-04-12');

  const eventTimes = [eventTime1, eventTime2];
  const setEventTimes = jest.fn();

  renderComponent({ eventTimes, setEventTimes });

  const toggleMenuButton = screen.getAllByRole('button', {
    name: /valinnat/i,
  })[0];
  userEvent.click(toggleMenuButton);
  const deleteButton = screen.getByRole('button', { name: /poista/i });
  act(() => userEvent.click(deleteButton));

  expect(setEventTimes).toBeCalledWith([eventTime2]);
});

test('should call setEventTimes when updating an event time', async () => {
  advanceTo('2021-04-12');

  const eventTimes = [eventTime1, eventTime2];
  const setEventTimes = jest.fn();

  renderComponent({ eventTimes, setEventTimes });

  const toggleMenuButton = screen.getAllByRole('button', {
    name: /valinnat/i,
  })[0];
  userEvent.click(toggleMenuButton);
  const editButton = screen.getByRole('button', {
    name: /muokkaa/i,
  });
  userEvent.click(editButton);

  const startTimeInput = screen.getByRole('textbox', {
    name: /tapahtuma alkaa/i,
  });
  userEvent.click(startTimeInput);
  userEvent.clear(startTimeInput);
  userEvent.type(startTimeInput, '02.05.2021 13.00');
  await waitFor(() => expect(startTimeInput).toHaveValue('02.05.2021 13.00'));

  const updateButton = screen.getByRole('button', {
    name: /tallenna muutokset/i,
  });
  act(() => userEvent.click(updateButton));

  await waitFor(() => {
    expect(setEventTimes).toBeCalledWith([
      { ...eventTime1, startTime: new Date('2021-05-02T13:00:00.000Z') },
      eventTime2,
    ]);
  });
});
