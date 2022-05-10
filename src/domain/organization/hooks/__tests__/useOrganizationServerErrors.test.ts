/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from '@apollo/client';
import { act, renderHook } from '@testing-library/react';

import useOrganizationServerErrors from '../useOrganizationServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => useOrganizationServerErrors());
  // Test the initial state of the request
  expect(result.current.serverErrorItems).toEqual([]);
  return { result };
};

it('should set server error items', async () => {
  const callbackFn = jest.fn();
  const { result } = getHookWrapper();

  const error = new ApolloError({
    networkError: {
      result: {
        detail: 'Metodi "POST" ei ole sallittu.',
        name: ['The name must be specified.'],
      },
    } as any,
  });

  act(() => result.current.showServerErrors({ callbackFn, error }));

  expect(result.current.serverErrorItems).toEqual([
    { label: '', message: 'Metodi "POST" ei ole sallittu.' },
    { label: 'Nimi', message: 'Nimi on pakollinen.' },
  ]);
  expect(callbackFn).toBeCalled();
});
