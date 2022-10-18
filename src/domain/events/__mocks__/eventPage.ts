import { MockedResponse } from '@apollo/client/testing';

import { EventsDocument } from '../../../generated/graphql';
import { fakeEvents } from '../../../utils/mockDataUtils';
import { organizationId } from '../../organization/__mocks__/organization';
import { EVENT_LIST_INCLUDES, EVENTS_PAGE_SIZE } from '../constants';

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

export {
  draftEventsCount,
  mockedBaseDraftEventsResponse,
  mockedBasePublicEventsResponse,
  mockedBaseWaitingApprovalEventsResponse,
  mockedDraftEventsResponse,
  mockedPublicEventsResponse,
  mockedSortedWaitingApprovalEventsResponse,
  mockedWaitingApprovalEventsResponse,
  publicEventsCount,
  waitingApprovalEvents,
  waitingApprovalEventsCount,
};
