import { MockedResponse } from '@apollo/client/testing';
import React from 'react';
import { Route } from 'react-router';

import { DEPRECATED_ROUTES, ROUTES, TEST_USER_ID } from '../../../../constants';
import { UserDocument } from '../../../../generated/graphql';
import { setFeatureFlags } from '../../../../test/featureFlags/featureFlags';
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
  enrolmentId,
  mockedEnrolmentResponse,
} from '../../../enrolment/__mocks__/editEnrolmentPage';
import { eventName, mockedEventResponse } from '../../../event/__mocks__/event';
import {
  mockedEventsResponse,
  mockedPlacesResponse,
  searchText,
} from '../../../eventSearch/__mocks__/eventSearchPage';
import {
  keyword,
  mockedKeywordResponse,
} from '../../../keyword/__mocks__/editKeywordPage';
import {
  mockedRegistrationResponse,
  registrationId,
} from '../../../registration/__mocks__/editRegistrationPage';
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

const mocks = [
  mockedEnrolmentResponse,
  mockedEventResponse,
  mockedEventsResponse,
  mockedKeywordResponse,
  mockedPlacesResponse,
  mockedRegistrationResponse,
  mockedUserResponse,
];

const renderRoute = (route: string, locale: Language = 'fi') =>
  render(<Route path={`/:locale/`} component={LocaleRoutes} />, {
    mocks,
    routes: [`/${locale}${route}`],
    store,
  });

beforeEach(() => {
  setFeatureFlags({ SHOW_ADMIN: true, SHOW_REGISTRATION: true });
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
    `${ROUTES.EDIT_REGISTRATION.replace(':id', registrationId)}`
  );

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /ilmoittautumisaika/i });
  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

it('should render registration enrolments page', async () => {
  const { history } = renderRoute(
    `${ROUTES.REGISTRATION_ENROLMENTS.replace(
      ':registrationId',
      registrationId
    )}`
  );

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: eventName }, { timeout: 30000 });
  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments`
  );
});

it('should render create enrolment page', async () => {
  const { history } = renderRoute(
    `${ROUTES.CREATE_ENROLMENT.replace(':registrationId', registrationId)}`
  );

  await loadingSpinnerIsNotInDocument();
  await screen.findByText(/ilmoittautujan perustiedot/i);
  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/create`
  );
});

it('should render edit enrolment page', async () => {
  const { history } = renderRoute(
    `${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
      ':registrationId',
      registrationId
    ).replace(':enrolmentId', enrolmentId)}`
  );

  await loadingSpinnerIsNotInDocument();
  await screen.findByText(/ilmoittautujan perustiedot/i);
  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`
  );
});

it('should render keywords page', async () => {
  const { history } = renderRoute(`${ROUTES.KEYWORDS}`);

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /avainsanat/i });
  expect(history.location.pathname).toBe('/fi/admin/keywords');
});

it('should render create keyword page', async () => {
  const { history } = renderRoute(`${ROUTES.CREATE_KEYWORD}`);

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /lisää avainsana/i });
  expect(history.location.pathname).toBe('/fi/admin/keywords/create');
});

it('should render edit keyword page', async () => {
  const { history } = renderRoute(
    `${ROUTES.EDIT_KEYWORD.replace(':id', keyword.id)}`
  );

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /muokkaa avainsanaa/i });
  expect(history.location.pathname).toBe(
    `/fi/admin/keywords/edit/${keyword.id}`
  );
});

it('should render keyword sets page', async () => {
  const { history } = renderRoute(`${ROUTES.KEYWORD_SETS}`);

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /avainsanaryhmät/i });
  expect(history.location.pathname).toBe('/fi/admin/keyword-sets');
});

it('should render create keyword set page', async () => {
  const { history } = renderRoute(`${ROUTES.CREATE_KEYWORD_SET}`);

  await loadingSpinnerIsNotInDocument();
  await screen.findByRole('heading', { name: /lisää avainsanaryhmä/i });
  expect(history.location.pathname).toBe('/fi/admin/keyword-sets/create');
});

it('should route to default help page', async () => {
  const { history } = renderRoute(ROUTES.HELP);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/help/instructions/general')
  );
});
