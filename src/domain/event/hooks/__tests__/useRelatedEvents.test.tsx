import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';
import map from 'lodash/map';
import React from 'react';

import { MAX_PAGE_SIZE } from '../../../../constants';
import { EventsDocument, SuperEventType } from '../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../utils/mockDataUtils';
import { TEST_NOCACHE_TIME } from '../../../../utils/testUtils';
import { EVENT_INCLUDES } from '../../constants';
import useRelatedEvents from '../useRelatedEvents';

const eventId = 'umbrella:1';
const subEventIds = ['recurring:1'];
const subSubEventIds = ['event:1'];
const subSubEventPage2Ids = ['event:2', 'event:3', 'event:4'];
const subSubSubEventIds = ['subevent:1'];
const subSubSubEvents = fakeEvents(
  subSubSubEventIds.length,
  subSubSubEventIds.map((id) => ({ id }))
);
const subSubEvents = fakeEvents(
  subSubEventIds.length,
  subSubEventIds.map((id) => ({
    id,
    subEvents: subSubSubEvents.data,
    superEventType: SuperEventType.Recurring,
  }))
);

const subSubPage2Events = fakeEvents(
  subSubEventPage2Ids.length,
  subSubEventPage2Ids.map((id) => ({ id }))
);

const subEvents = fakeEvents(
  subEventIds.length,
  subEventIds.map((id) => ({
    id,
    subEvents: subSubEvents.data,
    superEventType: SuperEventType.Umbrella,
  }))
);

const event = fakeEvent({
  id: eventId,
  subEvents: subEvents.data,
  superEventType: SuperEventType.Umbrella,
});

const subEventsResponse = {
  data: {
    events: subEvents,
  },
};

const count = subSubEventIds.length + subSubEventPage2Ids.length;
const subSubEventsResponse = {
  data: {
    events: {
      ...subSubEvents,
      meta: {
        ...subSubEvents.meta,
        count,
        next: 'http://localhost:8000/v1/event/?page=2',
      },
    },
  },
};
const subSubEventsPage2Response = {
  data: {
    events: {
      ...subSubPage2Events,
      meta: {
        ...subSubEvents.meta,
        count,
        previous: 'http://localhost:8000/v1/event/',
      },
    },
  },
};

const subSubSubEventsResponse = {
  data: {
    events: subSubSubEvents,
  },
};
const baseVariables = {
  createPath: undefined,
  include: EVENT_INCLUDES,
  nocache: TEST_NOCACHE_TIME,
  pageSize: MAX_PAGE_SIZE,
  showAll: true,
  sort: 'start_time',
};
const subEventsVariables = {
  ...baseVariables,
  superEvent: eventId,
};
const subSubEventsVariables = {
  ...baseVariables,
  superEvent: subEventIds[0],
};
const subSubSubEventsVariables = {
  ...baseVariables,
  superEvent: subSubEventIds[0],
};

const mocks = [
  {
    request: {
      query: EventsDocument,
      variables: subEventsVariables,
    },
    result: subEventsResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: subSubEventsVariables,
    },
    result: subSubEventsResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: { ...subSubEventsVariables, page: 2 },
    },
    result: subSubEventsPage2Response,
  },
  {
    request: {
      query: EventsDocument,
      variables: subSubSubEventsVariables,
    },
    result: subSubSubEventsResponse,
  },
];

const getHookWrapper = (mocks = []) => {
  const wrapper = ({ children }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
  const { result, waitForNextUpdate } = renderHook(
    () => useRelatedEvents(event),
    {
      wrapper,
    }
  );
  // Test the initial state of the request
  expect(result.current.loading).toBe(true);
  expect(result.current.events).toEqual([]);
  return { result, waitForNextUpdate };
};

test('should return all related events', async () => {
  const { result, waitForNextUpdate } = getHookWrapper(mocks);
  // Wait for the results
  await waitForNextUpdate();

  expect(result.current.loading).toBeFalsy();
  expect(map(result.current.events, 'id')).toEqual([
    eventId,
    ...subEventIds,
    ...subSubEventIds,
    ...subSubEventPage2Ids,
    ...subSubSubEventIds,
  ]);
});
