import range from 'lodash/range';

import { FULL_TEXT_LANGUAGES } from '../../../../constants';
import { EventsDocument, Meta } from '../../../../generated/graphql';
import { fakeEvents } from '../../../../utils/mockDataUtils';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  setupUser,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedUserResponse } from '../../../user/__mocks__/user';
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

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const TEST_PAGE_SIZE = 2;
const variables = {
  createPath: undefined,
  page: 1,
  pageSize: EVENTS_PAGE_SIZE,
  sort: DEFAULT_EVENT_SORT,
  end: null,
  eventStatus: [],
  eventType: [],
  include: EVENT_LIST_INCLUDES,
  location: [],
  publisher: [],
  start: null,
  fullText: '',
  fullTextLanguage: FULL_TEXT_LANGUAGES,
};

const eventNames = range(1, TEST_PAGE_SIZE + 1).map((n) => `Event name ${n}`);
const events = fakeEvents(
  TEST_PAGE_SIZE,
  eventNames.map((name) => ({ name: { fi: name }, publisher: null }))
);
const count = 30;
const meta: Meta = { ...events.meta, count };
const eventsResponse = {
  data: {
    events: {
      ...events,
      meta: { ...meta, next: 'http://localhost:8000/v1/event/?page=2' },
    },
  },
};
const mockedEventsResponse = {
  request: { query: EventsDocument, variables },
  result: eventsResponse,
};

const mockedEventsResponseAfterSortReset = {
  request: { query: EventsDocument, variables },
  result: eventsResponse,
};

const page2EventNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Page 2 event ${n}`
);
const page2Events = fakeEvents(
  TEST_PAGE_SIZE,
  page2EventNames.map((name) => ({ name: { fi: name }, publisher: null }))
);
const page2EventsResponse = {
  data: {
    events: {
      ...page2Events,
      meta: { ...meta, previous: 'http://localhost:8000/v1/event/' },
    },
  },
};
const page2EventsVariables = { ...variables, page: 2 };
const mockedPage2EventsResponse = {
  request: { query: EventsDocument, variables: page2EventsVariables },
  result: page2EventsResponse,
};

const sortedEventNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Sorted event ${n}`
);
const sortedEvents = fakeEvents(
  TEST_PAGE_SIZE,
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
  mockedEventsResponseAfterSortReset,
  mockedUserResponse,
];

const defaultProps: EventListContainerProps = {
  activeTab: EVENTS_PAGE_TABS.PUBLISHED,
  baseVariables: variables,
  listType: EVENT_LIST_TYPES.TABLE,
  setListType: vi.fn(),
  showListTypeSelector: true,
  skip: false,
};

const getElement = (key: 'page1' | 'page2' | 'sortSelect') => {
  switch (key) {
    case 'page1':
      return screen.getByRole('link', { name: 'Sivu 1' });
    case 'page2':
      return screen.getByRole('link', { name: 'Sivu 2' });
    case 'sortSelect':
      return screen.getByRole('combobox', { name: /lajitteluperuste/i });
  }
};

const findElement = (key: 'sortOptionLastModified' | 'sortOptionName') => {
  switch (key) {
    case 'sortOptionLastModified':
      return screen.findByRole('option', {
        name: /viimeksi muokattu, laskeva/i,
      });
    case 'sortOptionName':
      return screen.findByRole('option', {
        name: /nimi, nouseva/i,
      });
  }
};

const ensureSortMenuIsOpen = async (user: ReturnType<typeof setupUser>) => {
  const sortSelect = getElement('sortSelect');

  if (sortSelect.getAttribute('aria-expanded') !== 'true') {
    await user.click(sortSelect);
  }

  await waitFor(() =>
    expect(getElement('sortSelect')).toHaveAttribute('aria-expanded', 'true')
  );
};

const renderComponent = (
  props?: Partial<Omit<EventListContainerProps, 'showListTypeSelector'>>
) => render(<EventList {...defaultProps} {...props} />, { mocks });

test('should navigate between pages', async () => {
  const user = setupUser();
  const { history } = renderComponent();

  // Page 1 event should be visible.
  await screen.findByText(eventNames[0]);
  expect(
    screen.queryByRole('button', { name: /Lajitteluperuste/i })
  ).not.toBeInTheDocument();

  const page2Button = getElement('page2');
  await user.click(page2Button);

  // Page 2 event should be visible.
  await screen.findByText(page2EventNames[0]);
  await waitFor(() => expect(history.location.search).toBe('?page=2'));

  // Should clear page from url search if selecting the first page
  const page1Button = getElement('page1');
  await user.click(page1Button);

  await waitFor(() => expect(history.location.search).toBe(''));
});

test('should change sort order', async () => {
  const user = setupUser();
  const { history } = renderComponent({ listType: EVENT_LIST_TYPES.CARD_LIST });

  // Page 1 events should be visible.
  await screen.findByRole('heading', { name: eventNames[0] });
  await waitFor(() => expect(history.location.search).toBe(''));

  await ensureSortMenuIsOpen(user);

  const sortOptionName = await findElement('sortOptionName');

  await user.click(sortOptionName);

  // Sorted events should be visible.
  await screen.findByRole('heading', { name: sortedEventNames[0] });
  await waitFor(() => expect(history.location.search).toBe('?sort=name'));

  await ensureSortMenuIsOpen(user);

  // Should clear sort from url search if selecting default sort value
  const sortOptionLastModified = await findElement('sortOptionLastModified');
  await user.click(sortOptionLastModified);
  await waitFor(() => expect(history.location.search).toBe(''));
  await screen.findByRole('heading', { name: eventNames[0] });
});
