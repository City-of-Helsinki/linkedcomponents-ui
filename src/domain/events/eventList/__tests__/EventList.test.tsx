import range from 'lodash/range';
import React from 'react';

import { EventsDocument, Meta } from '../../../../generated/graphql';
import { fakeEvents } from '../../../../utils/mockDataUtils';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import {
  DEFAULT_EVENT_SORT,
  EVENT_LIST_INCLUDES,
  EVENT_LIST_TYPES,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_SIZE,
  EVENTS_PAGE_TABS,
} from '../../constants';
import EventList, { EventListProps } from '../EventList';

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
const eventsResponse = { data: { events: { ...events, meta } } };
const mockedEventsResponse = {
  request: {
    query: EventsDocument,
    variables,
  },
  result: eventsResponse,
};

const page2EventNames = range(1, EVENTS_PAGE_SIZE + 1).map(
  (n) => `Page 2 event ${n}`
);
const page2Events = fakeEvents(
  EVENTS_PAGE_SIZE,
  page2EventNames.map((name) => ({
    name: { fi: name },
    publisher: null,
  }))
);
const page2EventsResponse = { data: { events: { ...page2Events, meta } } };
const page2EventsVariables = { ...variables, page: 2 };
const mockedPage2EventsResponse = {
  request: {
    query: EventsDocument,
    variables: page2EventsVariables,
  },
  result: page2EventsResponse,
};

const sortedEventNames = range(1, EVENTS_PAGE_SIZE + 1).map(
  (n) => `Sorted event ${n}`
);
const sortedEvents = fakeEvents(
  EVENTS_PAGE_SIZE,
  sortedEventNames.map((name) => ({
    name: { fi: name },
    publisher: null,
  }))
);
const sortedEventsResponse = { data: { events: { ...sortedEvents, meta } } };
const sortedEventsVariables = { ...variables, sort: EVENT_SORT_OPTIONS.NAME };
const mockedSortedEventsResponse = {
  request: {
    query: EventsDocument,
    variables: sortedEventsVariables,
  },
  result: sortedEventsResponse,
};

const mocks = [
  mockedEventsResponse,
  mockedPage2EventsResponse,
  mockedSortedEventsResponse,
];

const defaultProps: EventListProps = {
  activeTab: EVENTS_PAGE_TABS.PUBLISHED,
  baseVariables: variables,
  listType: EVENT_LIST_TYPES.TABLE,
  setListType: jest.fn(),
  skip: false,
};

const getElement = (
  key: 'page2' | 'pagination' | 'sortOptionName' | 'sortSelect'
) => {
  switch (key) {
    case 'page2':
      return screen.getByRole('button', { name: 'Sivu 2' });
    case 'pagination':
      return screen.getByRole('navigation', { name: 'Sivunavigointi' });
    case 'sortOptionName':
      return screen.getByRole('option', {
        name: /nimi, nouseva/i,
        hidden: true,
      });
    case 'sortSelect':
      return screen.getByRole('button', { name: /Lajitteluperuste/i });
  }
};

const renderComponent = (props?: Partial<EventListProps>) =>
  render(<EventList {...defaultProps} {...props} />, { mocks });

test('should render events of page 2', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  expect(
    screen.queryByRole('button', { name: /Lajitteluperuste/i })
  ).not.toBeInTheDocument();

  // Page 1 event should be visible. Test only first 2 to improve performance
  screen.getByRole('button', { name: eventNames[0] });
  screen.getByRole('button', { name: eventNames[1] });

  const page2Button = getElement('page2');
  userEvent.click(page2Button);

  await loadingSpinnerIsNotInDocument();
  // Page 2 event should be visible. Test only first 2 to improve performance
  screen.getByRole('button', { name: page2EventNames[0] });
  screen.getByRole('button', { name: page2EventNames[1] });
});

test('should change sort order', async () => {
  renderComponent({ listType: EVENT_LIST_TYPES.CARD_LIST });

  await loadingSpinnerIsNotInDocument();

  // Page 1 events should be visible. Test only first 2 to improve performance
  screen.getByRole('heading', { name: eventNames[0] });
  screen.getByRole('heading', { name: eventNames[1] });

  const sortSelect = getElement('sortSelect');
  userEvent.click(sortSelect);

  const sortOptionName = getElement('sortOptionName');
  userEvent.click(sortOptionName);

  await loadingSpinnerIsNotInDocument();
  // Sorted events should be visible. Test only first 2 to improve performance
  screen.getByRole('heading', { name: sortedEventNames[0] });
  screen.getByRole('heading', { name: sortedEventNames[1] });
});
