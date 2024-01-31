/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import { PropsWithChildren } from 'react';

import {
  event,
  mockedEventResponse,
} from '../../../../common/components/eventSelector/__mocks__/eventSelector';
import { createCache } from '../../../app/apollo/apolloClient';
import {
  mockedDefaultPriceGroupsResponse,
  mockedPublisherPriceGroupsResponse,
} from '../../__mocks__/priceGroups';
import usePriceGroupOptions, {
  UsePriceGroupOptionsProps,
} from '../usePriceGroupOptions';

const mocks = [
  mockedDefaultPriceGroupsResponse,
  mockedEventResponse,
  mockedPublisherPriceGroupsResponse,
];

const getHookWrapper = async (props?: UsePriceGroupOptionsProps) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <MockedProvider cache={createCache()} mocks={mocks}>
      {children}
    </MockedProvider>
  );

  const { result } = renderHook(() => usePriceGroupOptions(props), {
    wrapper,
  });
  // Test the initial state of the request
  expect(result.current.options).toEqual([]);
  return { result, waitFor };
};

test('should return price group without organization', async () => {
  const { result, waitFor } = await getHookWrapper();
  // Wait for the results
  await waitFor(() => expect(result.current.loading).toBeFalsy());
  await waitFor(() =>
    expect(result.current.options).toEqual([
      {
        isFree: false,
        label: 'Price group name',
        value: '123',
      },
    ])
  );
});

test('should return price group with organization', async () => {
  const { result, waitFor } = await getHookWrapper({ eventId: event.id });
  // Wait for the results
  await waitFor(() => expect(result.current.loading).toBeFalsy());
  await waitFor(() =>
    expect(result.current.options).toEqual([
      {
        isFree: false,
        label: 'Price group name',
        value: '123',
      },
      {
        isFree: false,
        label: 'Price group name 2',
        value: '234',
      },
    ])
  );
});
