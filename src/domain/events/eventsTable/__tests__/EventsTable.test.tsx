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
    'ID',
    'Julkaisija',
    'Nimi',
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
  const eventNames = range(1, 11).map((n) => `Event name ${n}`);
  renderComponent({
    events: fakeEvents(
      eventNames.length,
      eventNames.map((eventName) => ({ name: { fi: eventName } }))
    ).data,
  });

  for (const name of eventNames) {
    screen.getByRole('link', { name });
  }
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
