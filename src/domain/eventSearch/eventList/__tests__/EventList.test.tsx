import range from 'lodash/range';
import React from 'react';

import { testId as loadingSpinnerTestId } from '../../../../common/components/loadingSpinner/LoadingSpinner';
import { EventsDocument, Meta } from '../../../../generated/graphql';
import { fakeEvents } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
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

const findElement = (
  key: 'nameColumn' | 'page2' | 'pagination' | 'sortOptionName' | 'sortSelect'
) => {
  switch (key) {
    case 'nameColumn':
      return screen.findByRole('button', { name: 'Nimi' });
    case 'pagination':
      return screen.findByRole('navigation', { name: 'Sivunavigointi' });
    case 'page2':
      return screen.findByRole('button', { name: 'Sivu 2' });
    case 'sortOptionName':
      return screen.findByRole('option', {
        name: /nimi, nouseva/i,
        hidden: true,
      });
    case 'sortSelect':
      return screen.findByRole('button', { name: /Lajitteluperuste/i });
  }
};

const renderComponent = (props?: Partial<EventListProps>) =>
  render(<EventList {...defaultProps} {...props} />, { mocks });

test('should render events of page 2', async () => {
  renderComponent();

  await waitFor(() => {
    expect(screen.queryByTestId(loadingSpinnerTestId)).not.toBeInTheDocument();
  });
  await findElement('pagination');

  for (const name of eventNames) {
    expect(screen.queryByRole('heading', { name })).toBeInTheDocument();
  }

  const page2Button = await findElement('page2');
  userEvent.click(page2Button);

  for (const name of eventNamesPage2) {
    await screen.findByRole('heading', { name });
  }
});

test('should change sort order', async () => {
  const setSort = jest.fn();
  renderComponent({
    setSort,
  });

  await waitFor(() => {
    expect(screen.queryByTestId(loadingSpinnerTestId)).not.toBeInTheDocument();
  });

  for (const name of eventNames) {
    expect(screen.queryByRole('heading', { name })).toBeInTheDocument();
  }

  const sortSelect = await findElement('sortSelect');
  userEvent.click(sortSelect);

  const sortOptionName = await findElement('sortOptionName');
  userEvent.click(sortOptionName);

  expect(setSort).toBeCalledWith(EVENT_SORT_OPTIONS.NAME);

  for (const name of eventNamesSorted) {
    await screen.findByRole('heading', { name });
  }
});
