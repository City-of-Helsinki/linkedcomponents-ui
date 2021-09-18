import { MockedResponse } from '@apollo/client/testing';
import React from 'react';
import { Route } from 'react-router';

import { DEPRECATED_ROUTES, ROUTES, TEST_USER_ID } from '../../../../constants';
import { UserDocument } from '../../../../generated/graphql';
import { Language } from '../../../../types';
import { fakeUser } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
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

const storeState = fakeAuthenticatedStoreState();
const store = getMockReduxStore(storeState);

const adminOrganization = 'helsinki';
const userData = fakeUser({ adminOrganizations: [adminOrganization] });
const userResponse = { data: { user: userData } };
const mockedUserResponse: MockedResponse = {
  request: {
    query: UserDocument,
    variables: { id: TEST_USER_ID, createPath: undefined },
  },
  result: userResponse,
};

const mocks = [mockedEventsResponse, mockedPlacesResponse, mockedUserResponse];

const renderRoute = (route: string, locale: Language = 'fi') =>
  render(<Route path={`/:locale/`} component={LocaleRoutes} />, {
    mocks,
    routes: [`/${locale}${route}`],
    store,
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

it('should redirect to edit event page from deprecated event page', () => {
  const { history } = renderRoute(
    DEPRECATED_ROUTES.VIEW_EVENT.replace(':id', 'hel:123')
  );

  expect(history.location.pathname).toBe('/fi/events/edit/hel:123');
});

it('should redirect to terms of use page from deprecated terms page', () => {
  const { history } = renderRoute(DEPRECATED_ROUTES.TERMS);

  expect(history.location.pathname).toBe('/fi/help/support/terms-of-use');
});

it('should render event search page', async () => {
  const { history } = renderRoute(`${ROUTES.SEARCH}?text=${searchText}`);

  await screen.findByRole('searchbox', {
    name: /hae linked events -rajapinnasta/i,
  });
  expect(history.location.pathname).toBe('/fi/search');
});

it('should render registrations page', async () => {
  const { history } = renderRoute(`${ROUTES.REGISTRATIONS}?text=${searchText}`);

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /ilmoittautuminen/i });
  expect(history.location.pathname).toBe('/fi/registrations');
});

it('should render create registration page', async () => {
  const { history } = renderRoute(`${ROUTES.CREATE_REGISTRATION}`);

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /ilmoittautumisaika/i });
  expect(history.location.pathname).toBe('/fi/registrations/create');
});

it('should render edit registration page', async () => {
  const { history } = renderRoute(
    `${ROUTES.EDIT_REGISTRATION.replace(':id', 'registration:1')}`
  );

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /ilmoittautumisaika/i });
  expect(history.location.pathname).toBe(
    '/fi/registrations/edit/registration:1'
  );
});

it('should render registration enrolments page', async () => {
  const { history } = renderRoute(
    `${ROUTES.REGISTRATION_ENROLMENTS.replace(
      ':registrationId',
      'registration:1'
    )}`
  );

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /Registration name 2/i });
  expect(history.location.pathname).toBe(
    '/fi/registrations/registration:1/enrolments'
  );
});

it('should route to default help page', async () => {
  const { history } = renderRoute(ROUTES.HELP);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/help/instructions/general')
  );
});
