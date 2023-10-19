import range from 'lodash/range';
import React from 'react';

import { fakeEvents } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { EVENT_SORT_OPTIONS } from '../../constants';
import EventsTable, { EventsTableProps } from '../EventsTable';

configure({ defaultHidden: true });

const eventName = 'Event name';
const eventId = 'event:1';

const defaultProps: EventsTableProps = {
  caption: 'Events table',
  events: [],
  setSort: vi.fn(),
  sort: EVENT_SORT_OPTIONS.NAME,
};

const mocks = [mockedOrganizationResponse, mockedOrganizationAncestorsResponse];

const renderComponent = (props?: Partial<EventsTableProps>) =>
  render(<EventsTable {...defaultProps} {...props} />, { mocks });

test('should render events table', () => {
  renderComponent();

  const columnHeaders = [
    'Nimi Järjestetty nousevaan järjestykseen',
    'Julkaisija',
    'Alkuaika',
    'Loppuaika',
    'Status',
  ];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should render all events', () => {
  const eventNames = range(1, 3).map((n) => `Event name ${n}`);
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
  const user = userEvent.setup();
  const { history } = renderComponent({
    events: fakeEvents(1, [{ name: { fi: eventName }, id: eventId }]).data,
  });

  await user.click(screen.getByRole('button', { name: eventName }));

  expect(history.location.pathname).toBe('/fi/events/edit/event:1');
});

test('should open event page by pressing enter on row', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    events: fakeEvents(1, [{ name: { fi: eventName }, id: eventId }]).data,
  });

  await user.type(screen.getByRole('button', { name: eventName }), '{enter}');

  expect(history.location.pathname).toBe('/fi/events/edit/event:1');
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = vi.fn();
  const user = userEvent.setup();

  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', {
    name: 'Nimi Järjestetty nousevaan järjestykseen',
  });
  await user.click(nameButton);
  await waitFor(() => expect(setSort).toBeCalledWith('-name'));

  const startTimeButton = screen.getByRole('button', { name: 'Alkuaika' });
  await user.click(startTimeButton);

  await waitFor(() => expect(setSort).toBeCalledWith('start_time'));

  const endTimeButton = screen.getByRole('button', { name: 'Loppuaika' });
  await user.click(endTimeButton);

  await waitFor(() => expect(setSort).toBeCalledWith('end_time'));
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({
    events: fakeEvents(1, [{ name: { fi: eventName }, id: eventId }]).data,
  });

  const withinRow = within(screen.getByRole('button', { name: eventName }));
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa tapahtumaa/i,
  });
  await user.click(editButton);

  expect(history.location.pathname).toBe('/fi/events/edit/event:1');
});
