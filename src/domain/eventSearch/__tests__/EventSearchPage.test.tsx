import range from 'lodash/range';
import React from 'react';

import { ROUTES } from '../../../constants';
import { EventsDocument } from '../../../generated/graphql';
import { fakeEvents } from '../../../utils/mockDataUtils';
import { render, screen } from '../../../utils/testUtils';
import { EVENTS_PAGE_SIZE } from '../../events/constants';
import EventSearchPage from '../EventSearchPage';

const searchValue = 'search';
const route = `${ROUTES.SEARCH}?text=${searchValue}`;

const variables = {
  createPath: undefined,
  include: ['in_language', 'location'],
  pageSize: 5,
  superEvent: 'none',
  text: searchValue,
  sort: '-last_modified_time',
};
const eventNames = range(1, EVENTS_PAGE_SIZE + 1).map((n) => `Event name ${n}`);
const events = fakeEvents(
  EVENTS_PAGE_SIZE,
  eventNames.map((name) => ({
    name: { fi: name },
    publisher: null,
  }))
);
const eventsResponse = { data: { events } };

const mocks = [
  {
    request: {
      query: EventsDocument,
      variables,
    },
    result: eventsResponse,
  },
];

const renderComponent = () =>
  render(<EventSearchPage />, { mocks, routes: [route] });

test('should render events in the event list', async () => {
  renderComponent();

  for (const name of eventNames) {
    await screen.findByRole('heading', { name });
  }
});
