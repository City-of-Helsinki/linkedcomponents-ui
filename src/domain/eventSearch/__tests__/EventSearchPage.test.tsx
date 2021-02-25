import React from 'react';

import {
  eventNames,
  mockedEventsResponse,
  mockedPlacesResponse,
  searchText,
} from '../__mocks__/eventSearchPage';
import { ROUTES } from '../../../constants';
import { render, screen } from '../../../utils/testUtils';
import EventSearchPage from '../EventSearchPage';

const route = `${ROUTES.SEARCH}?text=${searchText}`;
const mocks = [mockedEventsResponse, mockedPlacesResponse];

const renderComponent = () =>
  render(<EventSearchPage />, { mocks, routes: [route] });

test('should render events in the event list', async () => {
  renderComponent();

  for (const name of eventNames) {
    await screen.findByRole('heading', { name });
  }
});
