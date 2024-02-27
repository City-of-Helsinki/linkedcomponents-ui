/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from '@apollo/client';
import { act, renderHook } from '@testing-library/react';

import usePriceGroupServerErrors from '../usePriceGroupServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => usePriceGroupServerErrors());
  // Test the initial state of the request
  expect(result.current.serverErrorItems).toEqual([]);
  return { result };
};

it('should set generic server error items', async () => {
  const { result } = getHookWrapper();

  const error = new ApolloError({
    networkError: {
      result: { detail: 'Metodi "POST" ei ole sallittu.' },
    } as any,
  });

  act(() => result.current.showServerErrors({ error }));

  expect(result.current.serverErrorItems).toEqual([
    { label: '', message: 'Metodi "POST" ei ole sallittu.' },
  ]);
});

it('should set server error items', async () => {
  const callbackFn = vi.fn();
  const { result } = getHookWrapper();

  const error = new ApolloError({
    networkError: {
      result: { description: ['Kuvaus on pakollinen.'] },
    } as any,
  });

  act(() => result.current.showServerErrors({ callbackFn, error }));

  expect(result.current.serverErrorItems).toEqual([
    { label: 'Kuvaus', message: 'Kuvaus on pakollinen.' },
  ]);
  expect(callbackFn).toBeCalled();
});