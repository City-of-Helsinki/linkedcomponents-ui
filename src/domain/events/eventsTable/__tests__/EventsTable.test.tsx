import range from 'lodash/range';
import React from 'react';

import { fakeEvents } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
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

test('should open event page by clicking event', () => {
  const eventName = 'Event name';
  const eventId = 'event:1';
  const { history } = renderComponent({
    events: fakeEvents(1, [{ name: { fi: eventName }, id: eventId }]).data,
  });

  userEvent.click(screen.getByRole('button', { name: eventName }));

  expect(history.location.pathname).toBe('/fi/events/edit/event:1');
});

test('should open event page by pressing enter on row', () => {
  const eventName = 'Event name';
  const eventId = 'event:1';
  const { history } = renderComponent({
    events: fakeEvents(1, [{ name: { fi: eventName }, id: eventId }]).data,
  });

  userEvent.type(screen.getByRole('button', { name: eventName }), '{enter}');

  expect(history.location.pathname).toBe('/fi/events/edit/event:1');
});

test('should call setSort when clicking sortable column header', () => {
  const setSort = jest.fn();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', { name: 'Nimi' });
  userEvent.click(nameButton);
  expect(setSort).toBeCalledWith('-name');

  const startTimeButton = screen.getByRole('button', { name: 'Alkuaika' });
  userEvent.click(startTimeButton);

  expect(setSort).toBeCalledWith('start_time');

  const endTimeButton = screen.getByRole('button', { name: 'Loppuaika' });
  userEvent.click(endTimeButton);

  expect(setSort).toBeCalledWith('end_time');
});
