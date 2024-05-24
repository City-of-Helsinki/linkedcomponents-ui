import { MockedProvider } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import { PropsWithChildren } from 'react';

import { createCache } from '../../../app/apollo/apolloClient';
import {
  accountOptions,
  mockedOrganizationAccountsResponse,
} from '../../__mocks__/organization';
import { TEST_PUBLISHER_ID } from '../../constants';
import useOrganizationAccountOptions from '../useOrganizationAccountOptions';

const mocks = [mockedOrganizationAccountsResponse];

const getHookWrapper = () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <MockedProvider cache={createCache()} mocks={mocks}>
      {children}
    </MockedProvider>
  );

  const { result } = renderHook(
    () => useOrganizationAccountOptions({ organizationId: TEST_PUBLISHER_ID }),
    { wrapper }
  );
  // Test the initial state of the request
  expect(result.current.loading).toBe(true);
  expect(result.current.options).toEqual([]);
  return { result };
};

test('should return account options', async () => {
  const { result } = getHookWrapper();
  // Wait for the results
  await waitFor(() => expect(result.current.loading).toBeFalsy());
  await waitFor(() => expect(result.current.options).toEqual(accountOptions));
});
