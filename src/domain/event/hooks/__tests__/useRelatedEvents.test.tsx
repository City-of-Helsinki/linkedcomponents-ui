import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import map from 'lodash/map';
import React, { PropsWithChildren } from 'react';

import { createCache } from '../../../app/apollo/apolloClient';
import {
  event,
  eventId,
  mockedSubEventsResponse,
  mockedSubSubEventsPage2Response,
  mockedSubSubEventsResponse,
  mockedSubSubSubEventsResponse,
  subEventIds,
  subSubEventIds,
  subSubEventPage2Ids,
  subSubSubEventIds,
} from '../__mocks__/useRelatedEvents';
import useRelatedEvents from '../useRelatedEvents';

const mocks = [
  mockedSubEventsResponse,
  mockedSubSubEventsResponse,
  mockedSubSubEventsPage2Response,
  mockedSubSubSubEventsResponse,
];

const getHookWrapper = (mocks: MockedResponse[] = []) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <MockedProvider cache={createCache()} mocks={mocks}>
      {children}
    </MockedProvider>
  );
  const { result } = renderHook(() => useRelatedEvents(event), { wrapper });
  // Test the initial state of the request
  expect(result.current.loading).toBe(true);
  expect(result.current.events).toEqual([]);
  return { result };
};

test('should return all related events', async () => {
  const { result } = getHookWrapper(mocks);

  await waitFor(() => expect(result.current.loading).toBeFalsy());
  expect(map(result.current.events, 'id')).toEqual([
    eventId,
    ...subEventIds,
    ...subSubEventIds,
    ...subSubEventPage2Ids,
    ...subSubSubEventIds,
  ]);
});
