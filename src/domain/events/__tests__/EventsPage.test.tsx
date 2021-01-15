import merge from 'lodash/merge';
import React from 'react';

import { defaultStoreState } from '../../../constants';
import {
  EventsDocument,
  OrganizationDocument,
  UserDocument,
} from '../../../generated/graphql';
import {
  fakeEvents,
  fakeOrganization,
  fakeUser,
} from '../../../utils/mockDataUtils';
import {
  actWait,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
} from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import { API_CLIENT_ID } from '../../auth/constants';
import EventsPage from '../EventsPage';

configure({ defaultHidden: true });

const userId = 'user123';
const apiToken = { [API_CLIENT_ID]: 'api-token' };
const user = { profile: { name: 'Test user', sub: userId } };
const state = merge({}, defaultStoreState, {
  authentication: {
    oidc: { user },
    token: { apiToken },
  },
});

const adminOrganization = 'helsinki';
const userData = fakeUser({ adminOrganizations: [adminOrganization] });
const userResponse = { data: { user: userData } };

const organizationId = 'helsinki';
const organizationVariables = { createPath: undefined, id: organizationId };
const organization = fakeOrganization();
const organizationResponse = {
  data: { events: organization },
};

const waitingApprovalEventsVariables = {
  createPath: undefined,
  include: ['in_language', 'location'],
  pageSize: 5,
  superEventType: ['none'],
  adminUser: true,
  publisher: ['helsinki'],
  publicationStatus: 'draft',
};
const waitingApprovalEventsCount = 3;
const waitingApprovalEvents = fakeEvents(
  waitingApprovalEventsCount,
  Array(waitingApprovalEventsCount).fill({
    publisher: organizationId,
  })
);
const waitingApprovalEventsResponse = {
  data: { events: waitingApprovalEvents },
};

const publicEventsVariables = {
  createPath: undefined,
  include: ['in_language', 'location'],
  pageSize: 5,
  superEventType: ['none'],
  adminUser: true,
  publisher: ['helsinki'],
  publicationStatus: 'public',
};

const publicEventsCount = 2;
const publicEvents = fakeEvents(
  publicEventsCount,
  Array(publicEventsCount).fill({
    publisher: organizationId,
  })
);
const publicEventsResponse = {
  data: { events: publicEvents },
};

const draftEventsVariables = {
  createPath: undefined,
  include: ['in_language', 'location'],
  pageSize: 5,
  superEventType: ['none'],
  createdBy: 'me',
  publicationStatus: 'draft',
  showAll: true,
};

const draftEventsCount = 7;
const draftEvents = fakeEvents(
  draftEventsCount,
  Array(draftEventsCount).fill({
    publisher: organizationId,
  })
);
const draftEventsResponse = {
  data: { events: draftEvents },
};

const mocks = [
  {
    request: {
      query: UserDocument,
      variables: { id: userId, createPath: undefined },
    },
    result: userResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: waitingApprovalEventsVariables,
    },
    result: waitingApprovalEventsResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: publicEventsVariables,
    },
    result: publicEventsResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: draftEventsVariables,
    },
    result: draftEventsResponse,
  },
  {
    request: {
      query: OrganizationDocument,
      variables: organizationVariables,
    },
    // To make sure organization is found also after changing tab to published events
    newData: () => organizationResponse,
  },
];

const findElement = (
  key:
    | 'createEventButton'
    | 'draftsTab'
    | 'publishedTable'
    | 'publishedTab'
    | 'waitingApprovalTab'
    | 'waitingApprovalTable'
) => {
  switch (key) {
    case 'createEventButton':
      return screen.findByRole('button', { name: /lisää uusi tapahtuma/i });
    case 'draftsTab':
      return screen.findByRole('tab', {
        name: `Luonnokset (${draftEventsCount})`,
      });
    case 'publishedTab':
      return screen.findByRole('tab', {
        name: `Julkaistut (${publicEventsCount})`,
      });
    case 'publishedTable':
      return screen.findByRole('table', {
        name: /julkaistut tapahtumat, järjestys viimeksi muokattu, laskeva/i,
        hidden: true,
      });
    case 'waitingApprovalTab':
      return screen.findByRole('tab', {
        name: `Odottaa (${waitingApprovalEventsCount})`,
      });
    case 'waitingApprovalTable':
      return screen.findByRole('table', {
        name: /hyväksyntää odottavat tapahtumat, järjestys viimeksi muokattu, laskeva/i,
      });
  }
};

test('should show correct title if user is not logged in', async () => {
  render(<EventsPage />);

  await actWait(300);

  const title = document.title;

  expect(title).toBe(
    `${translations.notSigned.pageTitle} - ${translations.appName}`
  );
});

test('should render events page', async () => {
  const store = getMockReduxStore(state);
  render(<EventsPage />, { mocks, store });

  await findElement('waitingApprovalTab');
  await findElement('publishedTab');
  await findElement('draftsTab');
  await findElement('waitingApprovalTable');
});

test('should render events page', async () => {
  const store = getMockReduxStore(state);
  const { history } = render(<EventsPage />, { mocks, store });

  await findElement('waitingApprovalTab');
  const createEventButton = await findElement('createEventButton');
  userEvent.click(createEventButton);

  expect(history.location.pathname).toBe('/fi/events/create');
});

test('should change to public events', async () => {
  const store = getMockReduxStore(state);
  render(<EventsPage />, { mocks, store });

  await findElement('waitingApprovalTable');

  const publishedTab = await findElement('publishedTab');
  userEvent.click(publishedTab);

  await findElement('publishedTable');
});
