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
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_SIZE,
} from '../../../events/constants';
import EventList, { EventListProps } from '../EventList';

configure({ defaultHidden: true });

const count = 30;

const eventNames = range(1, EVENTS_PAGE_SIZE + 1).map((n) => `Event name ${n}`);
const events = fakeEvents(
  EVENTS_PAGE_SIZE,
  eventNames.map((name) => ({
    name: { fi: name },
    publisher: null,
  }))
);
const meta: Meta = {
  ...events.meta,
  count,
};
const eventsVariables = {
  createPath: undefined,
  page: 1,
  pageSize: EVENTS_PAGE_SIZE,
  sort: DEFAULT_EVENT_SORT,
};
const eventsResponse = { data: { events: { ...events, meta } } };

const eventNamesPage2 = range(1, EVENTS_PAGE_SIZE + 1).map(
  (n) => `Page 2 event ${n}`
);
const eventsPage2 = fakeEvents(
  EVENTS_PAGE_SIZE,
  eventNamesPage2.map((name) => ({
    name: { fi: name },
    publisher: null,
  }))
);
const eventsPage2Variables = {
  ...eventsVariables,
  page: 2,
};
const eventsPage2Response = {
  data: {
    events: {
      ...eventsPage2,
      meta,
    },
  },
};

const eventNamesSorted = range(1, EVENTS_PAGE_SIZE + 1).map(
  (n) => `Sorted event ${n}`
);
const eventsSorted = fakeEvents(
  EVENTS_PAGE_SIZE,
  eventNamesSorted.map((name) => ({
    name: { fi: name },
    publisher: null,
  }))
);
const eventsSortedVariables = {
  ...eventsVariables,
  sort: EVENT_SORT_OPTIONS.NAME,
};
const eventsSortedResponse = { data: { events: { ...eventsSorted, meta } } };

const mocks = [
  {
    request: {
      query: EventsDocument,
      variables: eventsVariables,
    },
    result: eventsResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: eventsPage2Variables,
    },
    result: eventsPage2Response,
  },
  {
    request: {
      query: EventsDocument,
      variables: eventsSortedVariables,
    },
    result: eventsSortedResponse,
  },
];

const defaultProps: EventListProps = {
  baseVariables: eventsVariables,
  setSort: jest.fn(),
  sort: DEFAULT_EVENT_SORT,
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
  getElement('pagination');

  // Page 1 event should be visible. Test only first 2 to improve performance
  screen.getByRole('heading', { name: eventNames[0] });
  screen.getByRole('heading', { name: eventNames[1] });

  const page2Button = getElement('page2');
  userEvent.click(page2Button);

  // Page 2 event should be visible. Test only first 2 to improve performance
  await screen.findByRole(
    'heading',
    { name: eventNamesPage2[0] },
    { timeout: 5000 }
  );
  screen.getByRole('heading', { name: eventNamesPage2[1] });
});

test('should change sort order', async () => {
  const setSort = jest.fn();
  renderComponent({
    setSort,
  });

  await loadingSpinnerIsNotInDocument();
  getElement('pagination');

  // Page 1 events should be visible. Test only first 2 to improve performance
  screen.getByRole('heading', { name: eventNames[0] });
  screen.getByRole('heading', { name: eventNames[1] });

  const sortSelect = getElement('sortSelect');
  userEvent.click(sortSelect);

  const sortOptionName = getElement('sortOptionName');
  userEvent.click(sortOptionName);

  expect(setSort).toBeCalledWith(EVENT_SORT_OPTIONS.NAME);

  // Sorted events should be visible. Test only first 2 to improve performance
  await screen.findByRole('heading', { name: eventNamesSorted[0] });
  screen.getByRole('heading', { name: eventNamesSorted[1] });
});
