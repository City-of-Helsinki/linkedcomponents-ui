import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../../generated/graphql';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import { getMockReduxStore } from '../../../../utils/testUtils';
import { createCache } from '../../../app/apollo/apolloClient';
import {
  baseFormValues,
  event,
  mockedCancelEventResponse,
  mockedCreateNewSubEventsResponse,
  mockedDeleteEventResponse,
  mockedOrganizationAncestorsResponse,
  mockedPostponeEventResponse,
  mockedUpdateEventResponse,
  mockedUpdateRecurringEventResponse,
  mockedUpdateSubEventsResponse,
  mockedUserResponse,
  newSubEventTimes,
  subEventTimes,
} from '../../__mocks__/editEventPage';
import {
  eventWithRecurringSuperEvent1,
  eventWithRecurringSuperEvent2,
  mockedDeleteEventWithRecurringSuperEventResponse,
  mockedDeleteSubEvent1Response,
  mockedPostponeEventWithRecurringSuperEventResponse,
  mockedRecurringEventWithDeletedSubEventResponse,
  mockedUpdateEventWithRecurringSuperEventResponse,
  mockedUpdateRecurringEventWithDeletedSubEventResponse,
  recurringSuperEvent,
} from '../__mocks__/useEventUpdateActions';
import useEventUpdateActions from '../useEventUpdateActions';

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);
const history = createMemoryHistory();
const commonMocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const getHookWrapper = (event: EventFieldsFragment, mocks = []) => {
  const wrapper = ({ children }) => (
    <Provider store={store}>
      <MockedProvider cache={createCache()} mocks={[...commonMocks, ...mocks]}>
        <Router history={history}>{children}</Router>
      </MockedProvider>
    </Provider>
  );
  const { result, waitFor, waitForNextUpdate } = renderHook(
    () => useEventUpdateActions({ event }),
    { wrapper }
  );
  return { result, waitFor, waitForNextUpdate };
};

test('should cancel single event', async () => {
  const onSuccess = jest.fn();
  const { result, waitFor, waitForNextUpdate } = getHookWrapper(event, [
    mockedCancelEventResponse,
  ]);
  // Wait for the results
  await waitForNextUpdate();

  await act(() => result.current.cancelEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should postpone single event with recurring super event', async () => {
  const onSuccess = jest.fn();
  const { result, waitFor, waitForNextUpdate } = getHookWrapper(
    eventWithRecurringSuperEvent1,
    [
      mockedPostponeEventWithRecurringSuperEventResponse,
      mockedRecurringEventWithDeletedSubEventResponse,
      mockedUpdateRecurringEventWithDeletedSubEventResponse,
    ]
  );
  // Wait for the results
  await waitForNextUpdate();

  await act(() => result.current.postponeEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should postpone single event', async () => {
  const onSuccess = jest.fn();
  const { result, waitFor, waitForNextUpdate } = getHookWrapper(event, [
    mockedPostponeEventResponse,
  ]);
  // Wait for the results
  await waitForNextUpdate();

  await act(() => result.current.postponeEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should delete single event', async () => {
  const onSuccess = jest.fn();
  const { result, waitFor, waitForNextUpdate } = getHookWrapper(event, [
    mockedDeleteEventResponse,
  ]);
  // Wait for the results
  await waitForNextUpdate();

  await act(() => result.current.deleteEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should delete single event with recurring super event', async () => {
  const onSuccess = jest.fn();
  const { result, waitFor, waitForNextUpdate } = getHookWrapper(
    eventWithRecurringSuperEvent1,
    [
      mockedDeleteEventWithRecurringSuperEventResponse,
      mockedRecurringEventWithDeletedSubEventResponse,
      mockedUpdateRecurringEventWithDeletedSubEventResponse,
    ]
  );
  // Wait for the results
  await waitForNextUpdate();

  await act(() => result.current.deleteEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should update single event', async () => {
  const onSuccess = jest.fn();
  const { result, waitFor, waitForNextUpdate } = getHookWrapper(event, [
    mockedUpdateEventResponse,
  ]);
  // Wait for the results
  await waitForNextUpdate();

  await act(() =>
    result.current.updateEvent(
      {
        ...baseFormValues,
        events: [
          {
            id: event.id,
            endTime: new Date(event.endTime),
            startTime: new Date(event.startTime),
          },
        ],
      },
      PublicationStatus.Public,
      { onSuccess }
    )
  );

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should update single event with recurring super event', async () => {
  const onSuccess = jest.fn();
  const { result, waitFor, waitForNextUpdate } = getHookWrapper(
    eventWithRecurringSuperEvent2,
    [
      mockedUpdateEventResponse,
      mockedUpdateEventWithRecurringSuperEventResponse,
    ]
  );
  // Wait for the results
  await waitForNextUpdate();

  await act(() =>
    result.current.updateEvent(
      {
        ...baseFormValues,
        events: [
          {
            id: eventWithRecurringSuperEvent2.id,
            endTime: new Date(eventWithRecurringSuperEvent2.endTime),
            startTime: new Date(eventWithRecurringSuperEvent2.startTime),
          },
        ],
      },
      PublicationStatus.Public,
      { onSuccess }
    )
  );

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should update recurring event', async () => {
  const onSuccess = jest.fn();
  const { result, waitFor, waitForNextUpdate } = getHookWrapper(
    recurringSuperEvent,
    [
      mockedDeleteSubEvent1Response,
      mockedUpdateSubEventsResponse,
      mockedCreateNewSubEventsResponse,
      mockedUpdateRecurringEventResponse,
    ]
  );
  // Wait for the results
  await waitForNextUpdate();

  await act(() =>
    result.current.updateEvent(
      {
        ...baseFormValues,
        eventTimes: [...newSubEventTimes],
        events: [{ ...subEventTimes[1] }],
      },
      PublicationStatus.Public,
      { onSuccess }
    )
  );

  await waitFor(() => expect(onSuccess).toBeCalled());
});
