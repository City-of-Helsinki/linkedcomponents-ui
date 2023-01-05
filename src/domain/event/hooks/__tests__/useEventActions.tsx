/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { unstable_HistoryRouter as Router } from 'react-router-dom';

import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../../generated/graphql';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { createCache } from '../../../app/apollo/apolloClient';
import { AuthContext } from '../../../auth/AuthContext';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import {
  baseFormValues,
  event,
  mockedCancelEventResponse,
  mockedCreateNewSubEventsResponse,
  mockedDeleteEventResponse,
  mockedPostponeEventResponse,
  mockedUpdateEventResponse,
  mockedUpdateRecurringEventResponse,
  mockedUpdateSubEventsResponse,
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
import useEventActions from '../useEventActions';

const authContextValue = fakeAuthenticatedAuthContextValue();

const history = createMemoryHistory();
const commonMocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const getHookWrapper = (
  event: EventFieldsFragment,
  mocks: MockedResponse[] = []
) => {
  const wrapper = ({ children }) => (
    <AuthContext.Provider value={authContextValue}>
      <MockedProvider cache={createCache()} mocks={[...commonMocks, ...mocks]}>
        <Router history={history as any}>{children}</Router>
      </MockedProvider>
    </AuthContext.Provider>
  );
  const { result } = renderHook(() => useEventActions(event), {
    wrapper,
  });
  return { result };
};

test('should cancel single event', async () => {
  const onSuccess = jest.fn();
  const { result } = getHookWrapper(event, [mockedCancelEventResponse]);

  await waitFor(() => expect(result.current.user).toBeDefined());
  await act(() => result.current.cancelEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should postpone single event with recurring super event', async () => {
  const onSuccess = jest.fn();
  const { result } = getHookWrapper(eventWithRecurringSuperEvent1, [
    mockedPostponeEventWithRecurringSuperEventResponse,
    mockedRecurringEventWithDeletedSubEventResponse,
    mockedUpdateRecurringEventWithDeletedSubEventResponse,
  ]);
  await waitFor(() => expect(result.current.user).toBeDefined());
  await act(() => result.current.postponeEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should postpone single event', async () => {
  const onSuccess = jest.fn();
  const { result } = getHookWrapper(event, [mockedPostponeEventResponse]);
  await waitFor(() => expect(result.current.user).toBeDefined());
  await act(() => result.current.postponeEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should delete single event', async () => {
  const onSuccess = jest.fn();
  const { result } = getHookWrapper(event, [mockedDeleteEventResponse]);
  await waitFor(() => expect(result.current.user).toBeDefined());
  await act(() => result.current.deleteEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should delete single event with recurring super event', async () => {
  const onSuccess = jest.fn();
  const { result } = getHookWrapper(eventWithRecurringSuperEvent1, [
    mockedDeleteEventWithRecurringSuperEventResponse,
    mockedRecurringEventWithDeletedSubEventResponse,
    mockedUpdateRecurringEventWithDeletedSubEventResponse,
  ]);
  await waitFor(() => expect(result.current.user).toBeDefined());
  await act(() => result.current.deleteEvent({ onSuccess }));

  await waitFor(() => expect(onSuccess).toBeCalled());
});

test('should update single event', async () => {
  const onSuccess = jest.fn();
  const { result } = getHookWrapper(event, [mockedUpdateEventResponse]);
  await waitFor(() => expect(result.current.user).toBeDefined());
  await act(() =>
    result.current.updateEvent(
      {
        ...baseFormValues,
        events: [
          {
            id: event.id,
            endTime: new Date(event.endTime as string),
            startTime: new Date(event.startTime as string),
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
  const { result } = getHookWrapper(eventWithRecurringSuperEvent2, [
    mockedUpdateEventResponse,
    mockedUpdateEventWithRecurringSuperEventResponse,
  ]);
  await waitFor(() => expect(result.current.user).toBeDefined());
  await act(() =>
    result.current.updateEvent(
      {
        ...baseFormValues,
        events: [
          {
            id: eventWithRecurringSuperEvent2.id,
            endTime: new Date(eventWithRecurringSuperEvent2.endTime as string),
            startTime: new Date(
              eventWithRecurringSuperEvent2.startTime as string
            ),
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
  const { result } = getHookWrapper(recurringSuperEvent, [
    mockedDeleteSubEvent1Response,
    mockedUpdateSubEventsResponse,
    mockedCreateNewSubEventsResponse,
    mockedUpdateRecurringEventResponse,
  ]);
  await waitFor(() => expect(result.current.user).toBeDefined());
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
