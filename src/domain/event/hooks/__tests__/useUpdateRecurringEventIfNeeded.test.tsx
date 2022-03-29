import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { advanceTo, clear } from 'jest-date-mock';
import omit from 'lodash/omit';
import React from 'react';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as Router } from 'react-router-dom';

import {
  EventDocument,
  SuperEventType,
  UpdateEventDocument,
} from '../../../../generated/graphql';
import generateAtId from '../../../../utils/generateAtId';
import { fakeEvent } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import { getMockReduxStore } from '../../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { EVENT_INCLUDES } from '../../constants';
import useUpdateRecurringEventIfNeeded from '../useUpdateRecurringEventIfNeeded';

afterEach(() => clear());

const publisher = TEST_PUBLISHER_ID;
const description = {
  ar: '<p>Description</p>',
  en: '<p>Description</p>',
  fi: '<p>Description</p>',
  ru: '<p>Description</p>',
  sv: '<p>Description</p>',
  zhHans: '<p>Description</p>',
};

const superEventId = 'super-event:1';
const subEventId1 = 'sub-event:1';
const subEventId2 = 'sub-event:2';
const subEventAtId1 = generateAtId(subEventId1, 'event');
const subEventAtId2 = generateAtId(subEventId2, 'event');
const superEventVariables = {
  id: 'super-event:1',
  include: EVENT_INCLUDES,
  createPath: undefined,
};

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const basePayload = {
  publicationStatus: 'public',
  audience: [],
  audienceMaxAge: null,
  audienceMinAge: null,
  enrolmentEndTime: null,
  enrolmentStartTime: null,
  externalLinks: [],
  images: [],
  inLanguage: [],
  keywords: [],
  maximumAttendeeCapacity: null,
  minimumAttendeeCapacity: null,
  offers: [{ isFree: true }],
  publisher,
  superEvent: null,
  superEventType: 'recurring',
  typeId: 'General',
  videos: [],
  id: superEventId,
};

const getHookWrapper = (mocks = []) => {
  const wrapper = ({ children }) => (
    <Provider store={store}>
      <Router history={createMemoryHistory()}>
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      </Router>
    </Provider>
  );
  const { result, waitForNextUpdate } = renderHook(
    () => useUpdateRecurringEventIfNeeded(),
    { wrapper }
  );

  // Test the initial state of the request
  expect(result.current.updateRecurringEventIfNeeded).toBeDefined();
  return { result, waitForNextUpdate };
};

test("should return null if event doesn't have super event ", async () => {
  const { result } = getHookWrapper();

  const event = fakeEvent();

  const response = await result.current.updateRecurringEventIfNeeded(event);
  expect(response).toBeNull();
});

test('should return null if super event type of super event is not recurring ', async () => {
  const superEvent = fakeEvent({
    id: superEventId,
    superEventType: SuperEventType.Umbrella,
  });

  const superEventResponse = { data: { event: superEvent } };
  const mockedSuperEventResponse: MockedResponse = {
    request: { query: EventDocument, variables: superEventVariables },
    result: superEventResponse,
  };
  const { result, waitForNextUpdate } = getHookWrapper([
    mockedSuperEventResponse,
    mockedUserResponse,
  ]);

  await waitForNextUpdate();

  const event = fakeEvent({ superEvent });
  const response = await result.current.updateRecurringEventIfNeeded(event);

  expect(response).toBeNull();
});

test('should return null if event is not editable', async () => {
  const superEvent = fakeEvent({
    id: superEventId,
    publisher: 'publisher:2',
    superEventType: SuperEventType.Recurring,
  });
  const superEventResponse = { data: { event: superEvent } };
  const mockedSuperEventResponse: MockedResponse = {
    request: { query: EventDocument, variables: superEventVariables },
    result: superEventResponse,
  };
  const { result, waitForNextUpdate } = getHookWrapper([
    mockedSuperEventResponse,
    mockedUserResponse,
  ]);

  await waitForNextUpdate();

  const event = fakeEvent({ superEvent });
  const response = await result.current.updateRecurringEventIfNeeded(event);

  expect(response).toBeNull();
});

test('should return null if recurring event start/end time is not changed', async () => {
  advanceTo('2021-05-05');
  const superEvent = fakeEvent({
    id: superEventId,
    publisher,
    endTime: '2021-12-31T21:00:00.000Z',
    startTime: '2021-12-31T18:00:00.000Z',
    subEvents: [
      fakeEvent({
        endTime: '2021-12-31T21:00:00.000Z',
        startTime: '2021-12-31T18:00:00.000Z',
      }),
    ],
    superEventType: SuperEventType.Recurring,
  });
  const superEventResponse = { data: { event: superEvent } };
  const mockedSuperEventResponse: MockedResponse = {
    request: { query: EventDocument, variables: superEventVariables },
    result: superEventResponse,
  };
  const { result, waitForNextUpdate } = getHookWrapper([
    mockedSuperEventResponse,
    mockedUserResponse,
  ]);

  await waitForNextUpdate();

  const event = fakeEvent({ superEvent });
  const response = await result.current.updateRecurringEventIfNeeded(event);

  expect(response).toBeNull();
});

test('should return null if new end date would be in past', async () => {
  advanceTo('2021-05-05');
  const superEvent = fakeEvent({
    id: superEventId,
    publisher,
    endTime: '2021-12-31T21:00:00.000Z',
    startTime: '2020-12-31T18:00:00.000Z',
    subEvents: [
      fakeEvent({
        endTime: '2021-04-05T21:00:00.000Z',
        startTime: '2020-12-31T18:00:00.000Z',
      }),
    ],
    superEventType: SuperEventType.Recurring,
  });
  const superEventResponse = { data: { event: superEvent } };
  const mockedSuperEventResponse: MockedResponse = {
    request: { query: EventDocument, variables: superEventVariables },
    result: superEventResponse,
  };
  const { result, waitForNextUpdate } = getHookWrapper([
    mockedSuperEventResponse,
    mockedUserResponse,
  ]);

  await waitForNextUpdate();

  const event = fakeEvent({ superEvent });
  const response = await result.current.updateRecurringEventIfNeeded(event);

  expect(response).toBeNull();
});

test('should update only start time if new end time would be in past but start time is changed', async () => {
  advanceTo('2021-05-05');
  const superEvent = fakeEvent({
    id: superEventId,
    publisher,
    description,
    endTime: '2021-12-31T21:00:00.000Z',
    startTime: '2021-12-31T18:00:00.000Z',
    subEvents: [
      fakeEvent({
        id: subEventId1,
        endTime: '2020-12-30T21:00:00.000Z',
        startTime: '2020-12-30T18:00:00.000Z',
      }),
      fakeEvent({
        id: subEventId2,
        endTime: '2021-01-15T21:00:00.000Z',
        startTime: '2021-01-15T18:00:00.000Z',
      }),
    ],
    superEventType: SuperEventType.Recurring,
  });
  const superEventResponse = { data: { event: superEvent } };
  const mockedSuperEventResponse: MockedResponse = {
    request: { query: EventDocument, variables: superEventVariables },
    result: superEventResponse,
  };

  const updateEventVariables = {
    input: {
      ...basePayload,
      description: omit(superEvent.description, '__typename'),
      infoUrl: omit(superEvent.infoUrl, '__typename'),
      location: {
        atId: superEvent.location.atId,
      },
      locationExtraInfo: omit(superEvent.locationExtraInfo, '__typename'),
      name: omit(superEvent.name, '__typename'),
      provider: omit(superEvent.provider, '__typename'),
      shortDescription: omit(superEvent.shortDescription, '__typename'),
      endTime: '2021-12-31T21:00:00.000Z',
      startTime: '2020-12-30T18:00:00.000Z',
      subEvents: [{ atId: subEventAtId1 }, { atId: subEventAtId2 }],
    },
  };

  const updatedSuperEvent = {
    ...superEvent,
    startTime: '2020-12-30T18:00:00.000Z',
  };
  const updateEventResponse = {
    data: {
      updateEvent: updatedSuperEvent,
    },
  };
  const mockedUpdateEventResponse: MockedResponse = {
    request: {
      query: UpdateEventDocument,
      variables: updateEventVariables,
    },
    result: updateEventResponse,
  };

  const { result, waitForNextUpdate } = getHookWrapper([
    mockedSuperEventResponse,
    mockedUserResponse,
    mockedUpdateEventResponse,
  ]);
  await waitForNextUpdate();

  const event = fakeEvent({ superEvent });

  await act(async () => {
    const response = await result.current.updateRecurringEventIfNeeded(event);
    expect(response).toEqual(updatedSuperEvent);
  });
});

test('should return new super event if recurring event is updated', async () => {
  advanceTo('2021-05-05');

  const superEvent = fakeEvent({
    id: superEventId,
    publisher,
    description,
    endTime: '2021-12-31T21:00:00.000Z',
    startTime: '2021-12-31T18:00:00.000Z',
    subEvents: [
      fakeEvent({
        id: subEventId1,
        endTime: '2021-12-30T21:00:00.000Z',
        startTime: '2021-12-30T18:00:00.000Z',
      }),
      fakeEvent({
        id: subEventId2,
        endTime: '2021-12-31T22:00:00.000Z',
        startTime: '2021-12-31T18:00:00.000Z',
      }),
    ],
    superEventType: SuperEventType.Recurring,
  });
  const superEventResponse = { data: { event: superEvent } };
  const mockedSuperEventResponse: MockedResponse = {
    request: { query: EventDocument, variables: superEventVariables },
    result: superEventResponse,
  };

  const updateEventVariables = {
    input: {
      ...basePayload,
      description: omit(superEvent.description, '__typename'),
      infoUrl: omit(superEvent.infoUrl, '__typename'),
      location: {
        atId: superEvent.location.atId,
      },
      locationExtraInfo: omit(superEvent.locationExtraInfo, '__typename'),
      name: omit(superEvent.name, '__typename'),
      provider: omit(superEvent.provider, '__typename'),
      shortDescription: omit(superEvent.shortDescription, '__typename'),
      endTime: '2021-12-31T22:00:00.000Z',
      startTime: '2021-12-30T18:00:00.000Z',
      subEvents: [{ atId: subEventAtId1 }, { atId: subEventAtId2 }],
    },
  };
  const updatedSuperEvent = {
    ...superEvent,
    endTime: '2021-12-31T22:00:00.000Z',
    startTime: '2021-12-30T18:00:00.000Z',
  };
  const updateEventResponse = {
    data: {
      updateEvent: updatedSuperEvent,
    },
  };
  const mockedUpdateEventResponse: MockedResponse = {
    request: {
      query: UpdateEventDocument,
      variables: updateEventVariables,
    },
    result: updateEventResponse,
  };

  const { result, waitForNextUpdate } = getHookWrapper([
    mockedSuperEventResponse,
    mockedUserResponse,
    mockedUpdateEventResponse,
  ]);
  await waitForNextUpdate();

  const event = fakeEvent({ superEvent });

  await act(async () => {
    const response = await result.current.updateRecurringEventIfNeeded(event);
    expect(response).toEqual(updatedSuperEvent);
  });
});
