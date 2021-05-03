import React from 'react';

import {
  eventNames,
  mockedEventsResponse,
  mockedPlacesResponse,
  searchText,
} from '../__mocks__/eventSearchPage';
import { ROUTES } from '../../../constants';
import {
  loadingSpinnerIsNotInDocument,
  render,
  screen,
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
