import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';
import map from 'lodash/map';
import React from 'react';

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

const getHookWrapper = (mocks = []) => {
  const wrapper = ({ children }) => (
    <MockedProvider cache={createCache()} mocks={mocks}>
      {children}
    </MockedProvider>
  );
  const { result, waitForNextUpdate } = renderHook(
    () => useRelatedEvents(event),
    { wrapper }
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
