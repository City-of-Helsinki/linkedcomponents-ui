import { MockedResponse } from '@apollo/client/testing';
import { createMemoryHistory } from 'history';
import React from 'react';

import { TEST_USER_ID } from '../../../constants';
import {
  EventsDocument,
  OrganizationDocument,
  OrganizationsDocument,
  UserDocument,
} from '../../../generated/graphql';
import {
  fakeEvents,
  fakeOrganization,
  fakeOrganizations,
  fakeUser,
} from '../../../utils/mockDataUtils';
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
  EVENT_LIST_INCLUDES,
  EVENT_LIST_TYPES,
  EVENTS_ACTIONS,
  EVENTS_PAGE_SIZE,
  EVENTS_PAGE_TABS,
} from '../constants';
import EventsPage from '../EventsPage';

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

const organizationId = 'helsinki';
const organization = fakeOrganization();
const organizationVariables = { createPath: undefined, id: organizationId };
const organizationResponse = {
  data: { organization },
};
const mockedOrganizationResponse: MockedResponse = {
  request: {
    query: OrganizationDocument,
    variables: organizationVariables,
  },
  // To make sure organization is found also after changing tab to published events
  newData: () => organizationResponse,
};

const organizationsVariables = {
  createPath: undefined,
  child: 'helsinki',
  pageSize: 100,
};
const organizationsResponse = {
  data: { organizations: fakeOrganizations(0) },
};
const mockedOrganizationsResponse: MockedResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationsVariables,
  },
  // To make sure organization is found also after changing tab to published events
  newData: () => organizationsResponse,
};

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
  Array(waitingApprovalEventsCount).fill({
    publisher: organizationId,
  })
);
const baseWaitingApprovalEventsVariables = {
  ...baseEventsVariables,
  adminUser: true,
  publisher: ['helsinki'],
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
  request: {
    query: EventsDocument,
    variables: waitingApprovalEventsVariables,
  },
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
  Array(publicEventsCount).fill({
    publisher: organizationId,
  })
);
const basePublicEventsVariables = {
  ...baseEventsVariables,
  adminUser: true,
  publisher: ['helsinki'],
  publicationStatus: 'public',
};
const publicEventsResponse = {
  data: { events: publicEvents },
};
const mockedBasePublicEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: basePublicEventsVariables,
  },
  result: publicEventsResponse,
};

const publicEventsVariables = {
  ...basePublicEventsVariables,
  ...commonSearchVariables,
};
const mockedPublicEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: publicEventsVariables,
  },
  result: publicEventsResponse,
};

const draftEventsCount = 7;
const draftEvents = fakeEvents(
  draftEventsCount,
  Array(draftEventsCount).fill({
    publisher: organizationId,
  })
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
  request: {
    query: EventsDocument,
    variables: baseDraftEventsVariables,
  },
  result: draftEventsResponse,
};
const draftEventsVariables = {
  ...baseDraftEventsVariables,
  ...commonSearchVariables,
};
const mockedDraftEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: draftEventsVariables,
  },
  result: draftEventsResponse,
};

const mocks = [
  mockedUserResponse,
  mockedBaseWaitingApprovalEventsResponse,
  mockedWaitingApprovalEventsResponse,
  mockedSortedWaitingApprovalEventsResponse,
  mockedBasePublicEventsResponse,
  mockedPublicEventsResponse,
  mockedBaseDraftEventsResponse,
  mockedDraftEventsResponse,
  mockedOrganizationResponse,
  mockedOrganizationsResponse,
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
      return screen.getByRole('button', { name: /nimi/i });
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
  const store = getMockReduxStore(storeState);
  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();

  getElement('waitingApprovalTab');
  getElement('publishedTab');
  getElement('draftsTab');
  getElement('waitingApprovalTable');
});

test('should open create event page', async () => {
  const store = getMockReduxStore(storeState);
  const { history } = render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();

  const createEventButton = getElement('createEventButton');
  userEvent.click(createEventButton);

  expect(history.location.pathname).toBe('/fi/events/create');
});

test('should store new listType to redux store', async () => {
  const store = getMockReduxStore(storeState);
  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();

  const eventCardTypeRadio = getElement('eventCardType');
  userEvent.click(eventCardTypeRadio);

  // Test if your store dispatched the expected actions
  const actions = store.getActions();
  const expectedAction = {
    payload: {
      listType: EVENT_LIST_TYPES.CARD_LIST,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  };
  expect(actions).toEqual([expectedAction]);
});

test('should store new active tab to redux store', async () => {
  const store = getMockReduxStore(storeState);
  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();

  const publishedTab = getElement('publishedTab');
  userEvent.click(publishedTab);

  // Test if your store dispatched the expected actions
  const actions = store.getActions();
  const expectedAction = {
    payload: {
      tab: EVENTS_PAGE_TABS.PUBLISHED,
    },
    type: EVENTS_ACTIONS.SET_EVENT_LIST_OPTIONS,
  };
  expect(actions).toEqual([expectedAction]);
});

test('should add sort parameter to search query', async () => {
  const store = getMockReduxStore(storeState);
  const { history } = render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();

  const sortNameButton = getElement('sortName');
  act(() => userEvent.click(sortNameButton));

  // Test if your store dispatched the expected actions
  expect(history.location.search).toBe('?sort=name');
});

test('should show public events when published tab is selected', async () => {
  const storeState = fakeAuthenticatedStoreState();
  storeState.events.listOptions = fakeEventsListOptionsState({
    tab: EVENTS_PAGE_TABS.PUBLISHED,
  });
  const store = getMockReduxStore(storeState);

  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();
  getElement('publishedTable');
});

test('should show draft events when drafts tab is selected', async () => {
  const storeState = fakeAuthenticatedStoreState();
  storeState.events.listOptions = fakeEventsListOptionsState({
    tab: EVENTS_PAGE_TABS.DRAFTS,
  });
  const store = getMockReduxStore(storeState);

  render(<EventsPage />, { mocks, store });

  await loadingSpinnerIsNotInDocument();
  getElement('draftsTable');
});

it('scrolls to event table row and calls history.replace correctly (deletes eventId from state)', async () => {
  const storeState = fakeAuthenticatedStoreState();
  storeState.events.listOptions = fakeEventsListOptionsState({
    tab: EVENTS_PAGE_TABS.WAITING_APPROVAL,
  });
  const store = getMockReduxStore(storeState);
  const route = '/fi/events';
  const history = createMemoryHistory();
  const historyObject = {
    search: '?dateTypes=tomorrow,this_week',
    state: { eventId: waitingApprovalEvents.data[0].id },
    pathname: route,
  };
  history.push(historyObject);

  const replaceSpy = jest.spyOn(history, 'replace');

  render(<EventsPage />, {
    history,
    mocks,
    routes: [route],
    store,
  });

  await loadingSpinnerIsNotInDocument();

  expect(replaceSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      search: historyObject.search,
      pathname: historyObject.pathname,
    })
  );

  const eventRowButton = screen.getByRole('button', {
    name: waitingApprovalEvents.data[0].name.fi,
  });
  await waitFor(() => expect(eventRowButton).toHaveFocus());
});
