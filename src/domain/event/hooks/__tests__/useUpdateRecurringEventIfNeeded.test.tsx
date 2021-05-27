import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { advanceTo, clear } from 'jest-date-mock';
import omit from 'lodash/omit';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { TEST_USER_ID } from '../../../../constants';
import {
  EventDocument,
  SuperEventType,
  UpdateEventDocument,
  UserDocument,
} from '../../../../generated/graphql';
import { fakeEvent, fakeUser } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import { getMockReduxStore } from '../../../../utils/testUtils';
import { EVENT_INCLUDES } from '../../constants';
import useUpdateRecurringEventIfNeeded from '../useUpdateRecurringEventIfNeeded';

afterEach(() => clear());

const publisher = 'publisher:1';

const superEventId = 'super-event:1';
const superEventVariables = {
  id: 'super-event:1',
  include: EVENT_INCLUDES,
  createPath: undefined,
};

const user = fakeUser({
  organization: publisher,
  adminOrganizations: [publisher],
  organizationMemberships: [publisher],
});
const userVariables = {
  createPath: undefined,
  id: TEST_USER_ID,
};
const userResponse = { data: { user } };
const mockedUserResponse: MockedResponse = {
  request: {
    query: UserDocument,
    variables: userVariables,
  },
  result: userResponse,
};

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

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

test('should return new super event if recurring event is updated', async () => {
  advanceTo('2021-05-05');

  const superEvent = fakeEvent({
    id: superEventId,
    publisher,
    description: {
      ar: '<p>Description</p>',
      en: '<p>Description</p>',
      fi: '<p>Description</p>',
      ru: '<p>Description</p>',
      sv: '<p>Description</p>',
      zhHans: '<p>Description</p>',
    },
    endTime: '2021-12-31T21:00:00.000Z',
    startTime: '2021-12-31T18:00:00.000Z',
    subEvents: [
      fakeEvent({
        id: 'subevent:1',
        endTime: '2021-12-30T21:00:00.000Z',
        startTime: '2021-12-30T18:00:00.000Z',
      }),
      fakeEvent({
        id: 'subevent:2',
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

  const updateEventVariables = {
    input: {
      publicationStatus: 'public',
      audience: [],
      audienceMaxAge: null,
      audienceMinAge: null,
      enrolmentEndTime: null,
      enrolmentStartTime: null,
      externalLinks: [],
      description: omit(superEvent.description, '__typename'),
      images: [],
      infoUrl: omit(superEvent.infoUrl, '__typename'),
      inLanguage: [],
      location: {
        atId: superEvent.location.atId,
      },
      keywords: [],
      locationExtraInfo: omit(superEvent.locationExtraInfo, '__typename'),
      maximumAttendeeCapacity: null,
      minimumAttendeeCapacity: null,
      name: omit(superEvent.name, '__typename'),
      offers: [{ isFree: true }],
      provider: omit(superEvent.provider, '__typename'),
      publisher,
      shortDescription: omit(superEvent.shortDescription, '__typename'),
      superEvent: undefined,
      superEventType: 'recurring',
      typeId: 'General',
      videos: [],
      endTime: '2021-12-31T21:00:00.000Z',
      startTime: '2021-12-30T18:00:00.000Z',
      id: 'super-event:1',
      subEvents: [
        { atId: 'https://api.hel.fi/linkedevents-test/v1/event/subevent:1/' },
        { atId: 'https://api.hel.fi/linkedevents-test/v1/event/subevent:2/' },
      ],
    },
  };
  const updatedSuperEvent = {
    ...superEvent,
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
