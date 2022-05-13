import range from 'lodash/range';
import React from 'react';

import { EventsDocument, Meta } from '../../../../generated/graphql';
import { fakeEvents } from '../../../../utils/mockDataUtils';
import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  DEFAULT_EVENT_SORT,
  EVENT_LIST_INCLUDES,
  EVENTS_PAGE_SIZE,
} from '../../../events/constants';
import EventList, { EventListContainerProps } from '../EventList';

configure({ defaultHidden: true });

const eventNames = range(1, EVENTS_PAGE_SIZE + 1).map((n) => `Event name ${n}`);
const events = fakeEvents(
  EVENTS_PAGE_SIZE,
  eventNames.map((name) => ({
    name: { fi: name },
    publisher: null,
  }))
);

const count = 30;
const meta: Meta = {
  ...events.meta,
  count,
};

const eventsVariables = {
  createPath: undefined,
  page: 1,
  pageSize: EVENTS_PAGE_SIZE,
  sort: DEFAULT_EVENT_SORT,
  end: null,
  eventType: [],
  include: EVENT_LIST_INCLUDES,
  location: [],
  start: null,
  text: '',
};
const eventsResponse = { data: { events: { ...events, meta } } };
const mockedEventsResponse = {
  request: {
    query: EventsDocument,
    variables: eventsVariables,
  },
  result: eventsResponse,
};

const mocks = [mockedEventsResponse];

const defaultProps: EventListContainerProps = {
  baseVariables: eventsVariables,
};

const getElement = (
  key:
    | 'page1'
    | 'page2'
    | 'pagination'
    | 'sortOptionLastModified'
    | 'sortOptionName'
    | 'sortSelect'
) => {
  switch (key) {
    case 'page1':
      return screen.getByRole('button', { name: 'Sivu 1' });
    case 'page2':
      return screen.getByRole('button', { name: 'Sivu 2' });
    case 'pagination':
      return screen.getByRole('navigation', { name: 'Sivunavigointi' });
    case 'sortOptionLastModified':
      return screen.getByRole('option', {
        name: /viimeksi muokattu, laskeva/i,
        hidden: true,
      });
    case 'sortOptionName':
      return screen.getByRole('option', {
        name: /nimi, nouseva/i,
        hidden: true,
      });
    case 'sortSelect':
      return screen.getByRole('button', { name: /Lajitteluperuste/i });
  }
};

const renderComponent = () =>
  render(<EventList {...defaultProps} />, {
    mocks,
  });

test('should show events', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 event should be visible.
  screen.getByRole('heading', { name: eventNames[0] });
  screen.getByRole('heading', { name: eventNames[1] });
});

test('should navigate between pages', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  getElement('pagination');

  const page2Button = getElement('page2');
  await act(async () => await user.click(page2Button));

  await waitFor(() => expect(history.location.search).toBe('?page=2'));

  // Should clear page from url search if selecting the first page
  const page1Button = getElement('page1');
  await act(async () => await user.click(page1Button));

  await waitFor(() => expect(history.location.search).toBe(''));
});

test('should change sort order', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortSelect = getElement('sortSelect');
  await act(async () => await user.click(sortSelect));

  const sortOptionName = getElement('sortOptionName');
  await act(async () => await user.click(sortOptionName));

  await waitFor(() => expect(history.location.search).toBe('?sort=name'));

  // Should clear sort from url search if selecting default sort value
  await act(async () => await user.click(sortSelect));
  const sortOptionLastModified = getElement('sortOptionLastModified');
  await act(async () => await user.click(sortOptionLastModified));

  await waitFor(() => expect(history.location.search).toBe(''));
});
