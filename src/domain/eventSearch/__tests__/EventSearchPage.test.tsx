import { createMemoryHistory } from 'history';
import React from 'react';

import {
  eventNames,
  events,
  mockedEventsResponse,
  mockedPlacesResponse,
  searchText,
} from '../__mocks__/eventSearchPage';
import { ROUTES } from '../../../constants';
import {
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  waitFor,
} from '../../../utils/testUtils';
import EventSearchPage from '../EventSearchPage';

const route = `${ROUTES.SEARCH}?text=${searchText}`;
const mocks = [mockedEventsResponse, mockedPlacesResponse];

const renderComponent = () =>
  render(<EventSearchPage />, { mocks, routes: [route] });

test('should render events in the event list', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await screen.getByRole('heading', { name: eventNames[0] });
  await screen.getByRole('heading', { name: eventNames[1] });
});

it('scrolls to event card and calls history.replace correctly (deletes eventId from state)', async () => {
  const route = ROUTES.SEARCH;
  const history = createMemoryHistory();
  const historyObject = {
    search: `?text=${searchText}`,
    state: { eventId: events.data[0].id },
    pathname: route,
  };
  history.push(historyObject);

  const replaceSpy = jest.spyOn(history, 'replace');

  render(<EventSearchPage />, {
    history,
    mocks,
    routes: [route],
  });

  await loadingSpinnerIsNotInDocument();

  expect(replaceSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      search: historyObject.search,
      pathname: historyObject.pathname,
    })
  );

  const eventCard = screen.getByRole('link', { name: eventNames[0] });
  await waitFor(() => expect(eventCard).toHaveFocus());
});
