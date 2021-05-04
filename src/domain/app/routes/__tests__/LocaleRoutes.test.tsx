import React from 'react';
import { Route } from 'react-router';

import { DEPRECATED_ROUTES, ROUTES } from '../../../../constants';
import { Language } from '../../../../types';
import {
  configure,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import {
  mockedEventsResponse,
  mockedPlacesResponse,
  searchText,
} from '../../../eventSearch/__mocks__/eventSearchPage';
import LocaleRoutes from '../LocaleRoutes';

configure({ defaultHidden: true });
const mocks = [mockedEventsResponse, mockedPlacesResponse];

const renderRoute = (route: string, locale: Language = 'fi') =>
  render(<Route path={`/:locale/`} component={LocaleRoutes} />, {
    mocks,
    routes: [`/${locale}${route}`],
  });

it('should redirect to events page from deprecated modaration page', () => {
  const { history } = renderRoute(DEPRECATED_ROUTES.MODERATION);

  expect(history.location.pathname).toBe('/fi/events');
});

it('should redirect to create event page from deprecated create event page', () => {
  const { history } = renderRoute(DEPRECATED_ROUTES.CREATE_EVENT);

  expect(history.location.pathname).toBe('/fi/events/create');
});

it('should redirect to edit event page from deprecated edit event page', () => {
  const { history } = renderRoute(
    DEPRECATED_ROUTES.UPDATE_EVENT.replace(':id', 'hel:123')
  );

  expect(history.location.pathname).toBe('/fi/events/edit/hel:123');
});

it('should render event search page', async () => {
  const { history } = renderRoute(`${ROUTES.SEARCH}?text=${searchText}`);

  await screen.findByRole('searchbox', {
    name: /hae linked events -rajapinnasta/i,
  });
  expect(history.location.pathname).toBe('/fi/search');
});

it('should route to default help page', async () => {
  const { history } = renderRoute(ROUTES.HELP);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/help/instructions/platform')
  );
});
