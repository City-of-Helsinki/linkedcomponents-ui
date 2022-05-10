import range from 'lodash/range';
import React from 'react';

import { fakeEvents } from '../../../../utils/mockDataUtils';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { EVENT_SORT_OPTIONS } from '../../constants';
import EventsTable, { EventsTableProps } from '../EventsTable';

configure({ defaultHidden: true });

const defaultProps: EventsTableProps = {
  caption: 'Events table',
  events: [],
  setSort: jest.fn(),
  sort: EVENT_SORT_OPTIONS.NAME,
};

const renderComponent = (props?: Partial<EventsTableProps>) =>
  render(<EventsTable {...defaultProps} {...props} />);

test('should render events table', () => {
  renderComponent();

  const columnHeaders = [
    'Nimi',
    'Julkaisija',
    'Alkuaika',
    'Loppuaika',
    'Status',
  ];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText('Ei tuloksia');
});

test('should render all events', () => {
  const eventNames = range(1, 5).map((n) => `Event name ${n}`);
  renderComponent({
    events: fakeEvents(
      eventNames.length,
      eventNames.map((eventName) => ({ name: { fi: eventName } }))
    ).data,
  });

  for (const name of eventNames) {
    screen.getByRole('button', { name });
  }
});

test('should open event page by clicking event', async () => {
  const eventName = 'Event name';
  const eventId = 'event:1';

  const user = userEvent.setup();
  const { history } = renderComponent({
    events: fakeEvents(1, [{ name: { fi: eventName }, id: eventId }]).data,
  });

  await act(
    async () =>
      await user.click(screen.getByRole('button', { name: eventName }))
  );

  expect(history.location.pathname).toBe('/fi/events/edit/event:1');
});

test('should open event page by pressing enter on row', async () => {
  const eventName = 'Event name';
  const eventId = 'event:1';

  const user = userEvent.setup();
  const { history } = renderComponent({
    events: fakeEvents(1, [{ name: { fi: eventName }, id: eventId }]).data,
  });

  await act(
    async () =>
      await user.type(
        screen.getByRole('button', { name: eventName }),
        '{enter}'
      )
  );

  expect(history.location.pathname).toBe('/fi/events/edit/event:1');
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = jest.fn();
  const user = userEvent.setup();

  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', { name: 'Nimi' });
  await act(async () => await user.click(nameButton));
  await waitFor(() => expect(setSort).toBeCalledWith('-name'));

  const startTimeButton = screen.getByRole('button', { name: 'Alkuaika' });
  await act(async () => await user.click(startTimeButton));

  await waitFor(() => expect(setSort).toBeCalledWith('start_time'));

  const endTimeButton = screen.getByRole('button', { name: 'Loppuaika' });
  await act(async () => await user.click(endTimeButton));

  await waitFor(() => expect(setSort).toBeCalledWith('end_time'));
});
