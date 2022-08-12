import { MockedResponse } from '@apollo/client/testing';
import { createMemoryHistory } from 'history';
import React from 'react';

import { EventsDocument } from '../../../generated/graphql';
import { fakeEvents } from '../../../utils/mockDataUtils';
import {
  fakeAuthenticatedStoreState,
  fakeEventsListOptionsState,
} from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  organizationId,
} from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  EVENT_LIST_INCLUDES,
  EVENT_LIST_TYPES,
  EVENTS_ACTIONS,
  EVENTS_PAGE_SIZE,
  EVENTS_PAGE_TABS,
} from '../constants';
import EventsPage from '../EventsPage';

configure({ defaultHidden: true });

const storeState = fakeAuthenticatedStoreState();
const store = getMockReduxStore(storeState);

const baseEventsVariables = {
  createPath: undefined,
  include: EVENT_LIST_INCLUDES,
  pageSize: EVENTS_PAGE_SIZE,
  superEvent: 'none',
};
const commonSearchVariables = {
  end: null,
  eventType: [],
  location: [],
  page: 1,
  sort: '-last_modified_time',
  start: null,
  text: '',
};

const waitingApprovalEventsCount = 3;
const waitingApprovalEvents = fakeEvents(
  waitingApprovalEventsCount,
  Array(waitingApprovalEventsCount).fill({ publisher: organizationId })
);
const baseWaitingApprovalEventsVariables = {
  ...baseEventsVariables,
  adminUser: true,
  publisher: [organizationId],
  publicationStatus: 'draft',
};
const waitingApprovalEventsResponse = {
  data: { events: waitingApprovalEvents },
};
const mockedBaseWaitingApprovalEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: baseWaitingApprovalEventsVariables,
  },
  result: waitingApprovalEventsResponse,
};

const waitingApprovalEventsVariables = {
  ...baseWaitingApprovalEventsVariables,
  ...commonSearchVariables,
};

const mockedWaitingApprovalEventsResponse: MockedResponse = {
  request: { query: EventsDocument, variables: waitingApprovalEventsVariables },
  result: waitingApprovalEventsResponse,
};

const mockedSortedWaitingApprovalEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: { ...waitingApprovalEventsVariables, sort: 'name' },
  },
  result: waitingApprovalEventsResponse,
};

const publicEventsCount = 2;
const publicEvents = fakeEvents(
  publicEventsCount,
  Array(publicEventsCount).fill({ publisher: organizationId })
);
const basePublicEventsVariables = {
  ...baseEventsVariables,
  adminUser: true,
  publisher: [organizationId],
  publicationStatus: 'public',
};
const publicEventsResponse = { data: { events: publicEvents } };
const mockedBasePublicEventsResponse: MockedResponse = {
  request: { query: EventsDocument, variables: basePublicEventsVariables },
  result: publicEventsResponse,
};

const publicEventsVariables = {
  ...basePublicEventsVariables,
  ...commonSearchVariables,
};
const mockedPublicEventsResponse: MockedResponse = {
  request: { query: EventsDocument, variables: publicEventsVariables },
  result: publicEventsResponse,
};

const draftEventsCount = 7;
const draftEvents = fakeEvents(
  draftEventsCount,
  Array(draftEventsCount).fill({ publisher: organizationId })
);
const baseDraftEventsVariables = {
  ...baseEventsVariables,
  createdBy: 'me',
  publicationStatus: 'draft',
  showAll: true,
};
const draftEventsResponse = {
  data: { events: draftEvents },
};
const mockedBaseDraftEventsResponse: MockedResponse = {
  request: { query: EventsDocument, variables: baseDraftEventsVariables },
  result: draftEventsResponse,
};
const draftEventsVariables = {
  ...baseDraftEventsVariables,
  ...commonSearchVariables,
};
const mockedDraftEventsResponse: MockedResponse = {
  request: { query: EventsDocument, variables: draftEventsVariables },
  result: draftEventsResponse,
};

const mocks = [
  mockedBaseWaitingApprovalEventsResponse,
  mockedWaitingApprovalEventsResponse,
  mockedSortedWaitingApprovalEventsResponse,
  mockedBasePublicEventsResponse,
  mockedPublicEventsResponse,
  mockedBaseDraftEventsResponse,
  mockedDraftEventsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

beforeEach(() => jest.clearAllMocks());

const getElement = (
  key:
    | 'createEventButton'
    | 'draftsTab'
    | 'draftsTable'
    | 'eventCardType'
    | 'publishedTab'
    | 'publishedTable'
    | 'sortName'
    | 'waitingApprovalTab'
    | 'waitingApprovalTable'
) => {
  switch (key) {
    case 'createEventButton':
      return screen.getByRole('button', { name: /lisää uusi tapahtuma/i });
    case 'draftsTab':
      return screen.getByRole('tab', {
        name: `Luonnokset (${draftEventsCount})`,
      });
    case 'draftsTable':
      return screen.getByRole('table', {
        name: /luonnokset, järjestys viimeksi muokattu, laskeva/i,
        hidden: true,
      });
    case 'eventCardType':
      return screen.getByRole('radio', { name: /korttinäkymä/i });
    case 'publishedTab':
      return screen.getByRole('tab', {
        name: `Julkaistut (${publicEventsCount})`,
      });
    case 'publishedTable':
      return screen.getByRole('table', {
        name: /julkaistut tapahtumat, järjestys viimeksi muokattu, laskeva/i,
        hidden: true,
      });
    case 'sortName':
      return screen.getByRole('button', { name: 'Nimi' });
    case 'waitingApprovalTab':
      return screen.getByRole('tab', {
        name: `Odottaa (${waitingApprovalEventsCount})`,
      });
    case 'waitingApprovalTable':
      return screen.getByRole('table', {
        name: /hyväksyntää odottavat tapahtumat, järjestys viimeksi muokattu, laskeva/i,
      });
  }
};

test('should show correct title, description and keywords', async () => {
  const pageTitle = 'Omat tapahtumat - Linked Events';
  const pageDescription =
    'Tapahtumalistaus. Hallinnoi tapahtumia: selaa ja muokkaa tapahtumia.';
  const pageKeywords =
    'minun, luetteloni, muokkaa, päivitä, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  render(<EventsPage />);

  await waitFor(() => expect(document.title).toEqual(pageTitle));

  const head = document.querySelector('head');
  const description = head?.querySelector('[name="description"]');
  const keywords = head?.querySelector('[name="keywords"]');
  const ogTitle = head?.querySelector('[property="og:title"]');
  const ogDescription = head?.querySelector('[property="og:description"]');

  expect(ogTitle).toHaveAttribute('content', pageTitle);
  expect(description).toHaveAttribute('content', pageDescription);
  expect(keywords).toHaveAttribute('content', pageKeywords);
  expect(ogDescription).toHaveAttribute('content', pageDescription);
});

test('should render events page', async () => {
  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument(10000);

  getElement('waitingApprovalTab');
  getElement('publishedTab');
  getElement('draftsTab');
  getElement('waitingApprovalTable');
});

test('should open create event page', async () => {
  const user = userEvent.setup();
  const { history } = render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument(10000);

  const createEventButton = getElement('createEventButton');
  await act(async () => await user.click(createEventButton));

  expect(history.location.pathname).toBe('/fi/events/create');
});

test('should store new listType to redux store', async () => {
  const user = userEvent.setup();
  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument(10000);

  const eventCardTypeRadio = getElement('eventCardType');
  await act(async () => await user.click(eventCardTypeRadio));

  // Test if your store dispatched the expected actions
  const actions = store.getActions();
  const expectedAction = {
    payload: { listType: EVENT_LIST_TYPES.CARD_LIST },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  };
  expect(actions).toEqual([expectedAction]);
});

test('should store new active tab to redux store', async () => {
  const store = getMockReduxStore(storeState);
  const user = userEvent.setup();

  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument(10000);

  const publishedTab = getElement('publishedTab');
  await act(async () => await user.click(publishedTab));

  // Test if your store dispatched the expected actions
  const actions = store.getActions();
  const expectedAction = {
    payload: { tab: EVENTS_PAGE_TABS.PUBLISHED },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  };
  expect(actions).toEqual([expectedAction]);
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();
  const { history } = render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument(10000);

  const sortNameButton = getElement('sortName');
  await act(async () => await user.click(sortNameButton));

  expect(history.location.search).toBe('?sort=name');
});

test('should show public events when published tab is selected', async () => {
  const storeState = fakeAuthenticatedStoreState();
  storeState.events.listOptions = fakeEventsListOptionsState({
    tab: EVENTS_PAGE_TABS.PUBLISHED,
  });
  const store = getMockReduxStore(storeState);

  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument(10000);
  getElement('publishedTable');
});

test('should show draft events when drafts tab is selected', async () => {
  const storeState = fakeAuthenticatedStoreState();
  storeState.events.listOptions = fakeEventsListOptionsState({
    tab: EVENTS_PAGE_TABS.DRAFTS,
  });
  const store = getMockReduxStore(storeState);

  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument(10000);
  getElement('draftsTable');
});

it('scrolls to event table row and calls history.replace correctly (deletes eventId from state)', async () => {
  const storeState = fakeAuthenticatedStoreState();
  storeState.events.listOptions = fakeEventsListOptionsState({
    tab: EVENTS_PAGE_TABS.WAITING_APPROVAL,
  });
  const store = getMockReduxStore(storeState);
  const route = '/fi/events';
  const search = '?dateTypes=tomorrow,this_week';
  const history = createMemoryHistory();
  history.push(
    { search, pathname: route },
    { eventId: waitingApprovalEvents.data[0]?.id }
  );

  const replaceSpy = jest.spyOn(history, 'replace');

  render(<EventsPage />, {
    history,
    mocks,
    routes: [route],
    store,
  });

  await loadingSpinnerIsNotInDocument(10000);

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: search },
      {}
    )
  );

  const eventRowButton = screen.getByRole('button', {
    name: waitingApprovalEvents.data[0]?.name?.fi as string,
  });
  await waitFor(() => expect(eventRowButton).toHaveFocus());
});
