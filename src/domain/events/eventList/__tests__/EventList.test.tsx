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
  EVENT_LIST_TYPES,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_SIZE,
  EVENTS_PAGE_TABS,
} from '../../constants';
import EventList, { EventListContainerProps } from '../EventList';

configure({ defaultHidden: true });

const variables = {
  createPath: undefined,
  page: 1,
  pageSize: EVENTS_PAGE_SIZE,
  sort: DEFAULT_EVENT_SORT,
  end: null,
  eventType: [],
  include: EVENT_LIST_INCLUDES,
  location: [],
  start: null,
  suprtEvent: 'null',
  text: '',
};

const eventNames = range(1, EVENTS_PAGE_SIZE + 1).map((n) => `Event name ${n}`);
const events = fakeEvents(
  EVENTS_PAGE_SIZE,
  eventNames.map((name) => ({ name: { fi: name }, publisher: null }))
);
const count = 30;
const meta: Meta = { ...events.meta, count };
const eventsResponse = { data: { events: { ...events, meta } } };
const mockedEventsResponse = {
  request: { query: EventsDocument, variables },
  result: eventsResponse,
};

const page2EventNames = range(1, EVENTS_PAGE_SIZE + 1).map(
  (n) => `Page 2 event ${n}`
);
const page2Events = fakeEvents(
  EVENTS_PAGE_SIZE,
  page2EventNames.map((name) => ({ name: { fi: name }, publisher: null }))
);
const page2EventsResponse = { data: { events: { ...page2Events, meta } } };
const page2EventsVariables = { ...variables, page: 2 };
const mockedPage2EventsResponse = {
  request: { query: EventsDocument, variables: page2EventsVariables },
  result: page2EventsResponse,
};

const sortedEventNames = range(1, EVENTS_PAGE_SIZE + 1).map(
  (n) => `Sorted event ${n}`
);
const sortedEvents = fakeEvents(
  EVENTS_PAGE_SIZE,
  sortedEventNames.map((name) => ({ name: { fi: name }, publisher: null }))
);
const sortedEventsResponse = { data: { events: { ...sortedEvents, meta } } };
const sortedEventsVariables = { ...variables, sort: EVENT_SORT_OPTIONS.NAME };
const mockedSortedEventsResponse = {
  request: { query: EventsDocument, variables: sortedEventsVariables },
  result: sortedEventsResponse,
};

const mocks = [
  mockedEventsResponse,
  mockedPage2EventsResponse,
  mockedSortedEventsResponse,
];

const defaultProps: EventListContainerProps = {
  activeTab: EVENTS_PAGE_TABS.PUBLISHED,
  baseVariables: variables,
  listType: EVENT_LIST_TYPES.TABLE,
  setListType: jest.fn(),
  showListTypeSelector: true,
  skip: false,
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

const renderComponent = (
  props?: Partial<Omit<EventListContainerProps, 'showListTypeSelector'>>
) => render(<EventList {...defaultProps} {...props} />, { mocks });

test('should navigate between pages', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();
  expect(
    screen.queryByRole('button', { name: /Lajitteluperuste/i })
  ).not.toBeInTheDocument();

  // Page 1 event should be visible.
  screen.getByRole('button', { name: eventNames[0] });

  const page2Button = getElement('page2');
  await act(async () => await user.click(page2Button));

  await loadingSpinnerIsNotInDocument();
  // Page 2 event should be visible.
  screen.getByRole('button', { name: page2EventNames[0] });
  await waitFor(() => expect(history.location.search).toBe('?page=2'));

  // Should clear page from url search if selecting the first page
  const page1Button = getElement('page1');
  await act(async () => await user.click(page1Button));

  await waitFor(() => expect(history.location.search).toBe(''));
});

test('should change sort order', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({ listType: EVENT_LIST_TYPES.CARD_LIST });

  await loadingSpinnerIsNotInDocument();

  // Page 1 events should be visible.
  screen.getByRole('heading', { name: eventNames[0] });
  await waitFor(() => expect(history.location.search).toBe(''));

  const sortSelect = getElement('sortSelect');
  await act(async () => await user.click(sortSelect));

  const sortOptionName = getElement('sortOptionName');
  await act(async () => await user.click(sortOptionName));

  await loadingSpinnerIsNotInDocument();
  // Sorted events should be visible.
  screen.getByRole('heading', { name: sortedEventNames[0] });
  await waitFor(() => expect(history.location.search).toBe('?sort=name'));

  // Should clear sort from url search if selecting default sort value
  await act(async () => await user.click(sortSelect));
  const sortOptionLastModified = getElement('sortOptionLastModified');
  await act(async () => await user.click(sortOptionLastModified));
  await waitFor(() => expect(history.location.search).toBe(''));
});
