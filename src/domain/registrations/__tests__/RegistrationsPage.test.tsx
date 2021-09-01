import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { TEST_USER_ID } from '../../../constants';
import { UserDocument } from '../../../generated/graphql';
import { fakeUser } from '../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import RegistrationsPage from '../RegistrationsPage';

configure({ defaultHidden: true });

const storeState = fakeAuthenticatedStoreState();

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

const mocks = [mockedUserResponse];

beforeEach(() => jest.clearAllMocks());

const getElement = (key: 'createRegistrationButton' | 'table') => {
  switch (key) {
    case 'createRegistrationButton':
      return screen.getByRole('button', { name: /lisää uusi/i });
    case 'table':
      return screen.getByRole('table', {
        name: /ilmoittautumiset, järjestys viimeksi muokattu, laskeva/i,
        hidden: true,
      });
  }
};

test('should show correct title, description and keywords', async () => {
  const pageTitle = 'Ilmoittautuminen - Linked Events';

  render(<RegistrationsPage />);

  await waitFor(() => expect(document.title).toEqual(pageTitle));

  const head = document.querySelector('head');
  const ogTitle = head?.querySelector('[property="og:title"]');

  expect(ogTitle).toHaveAttribute('content', pageTitle);
});

test('should render events page', async () => {
  const store = getMockReduxStore(storeState);
  render(<RegistrationsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();

  getElement('createRegistrationButton');
  getElement('table');
});

test('should open create event page', async () => {
  const store = getMockReduxStore(storeState);
  const { history } = render(<RegistrationsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();

  const createRegistrationButton = getElement('createRegistrationButton');
  userEvent.click(createRegistrationButton);

  expect(history.location.pathname).toBe('/fi/registrations/create');
});

// it('scrolls to event table row and calls history.replace correctly (deletes eventId from state)', async () => {
//   const storeState = fakeAuthenticatedStoreState();
//   storeState.events.listOptions = fakeEventsListOptionsState({
//     tab: EVENTS_PAGE_TABS.WAITING_APPROVAL,
//   });
//   const store = getMockReduxStore(storeState);
//   const route = '/fi/events';
//   const history = createMemoryHistory();
//   const historyObject = {
//     search: '?dateTypes=tomorrow,this_week',
//     state: { eventId: waitingApprovalEvents.data[0].id },
//     pathname: route,
//   };
//   history.push(historyObject);

//   const replaceSpy = jest.spyOn(history, 'replace');

//   render(<EventsPage />, {
//     history,
//     mocks,
//     routes: [route],
//     store,
//   });

//   await loadingSpinnerIsNotInDocument();

//   expect(replaceSpy).toHaveBeenCalledWith(
//     expect.objectContaining({
//       search: historyObject.search,
//       pathname: historyObject.pathname,
//     })
//   );

//   const eventRowButton = screen.getByRole('button', {
//     name: waitingApprovalEvents.data[0].name.fi,
//   });
//   await waitFor(() => expect(eventRowButton).toHaveFocus());
// });
