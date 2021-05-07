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
  waitFor,
} from '../../../../utils/testUtils';
import {
  DEFAULT_EVENT_SORT,
  EVENT_LIST_INCLUDES,
  EVENTS_PAGE_SIZE,
} from '../../../events/constants';
import EventList, { EventListProps } from '../EventList';

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

const defaultProps: EventListProps = {
  baseVariables: eventsVariables,
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

const renderComponent = () =>
  render(<EventList {...defaultProps} />, {
    mocks,
  });

test('should show events', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  // Page 1 event should be visible. Test only first 2 to improve performance
  screen.getByRole('heading', { name: eventNames[0] });
  screen.getByRole('heading', { name: eventNames[1] });
});

test('should change to event list page 2', async () => {
  const { history } = renderComponent();
  await loadingSpinnerIsNotInDocument();

  getElement('pagination');
  const page2Button = getElement('page2');
  userEvent.click(page2Button);

  await waitFor(() => expect(history.location.search).toBe('?page=2'));
});

test('should change sort order', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortSelect = getElement('sortSelect');
  userEvent.click(sortSelect);

  const sortOptionName = getElement('sortOptionName');
  userEvent.click(sortOptionName);

  await waitFor(() => expect(history.location.search).toBe('?sort=name'));
});
