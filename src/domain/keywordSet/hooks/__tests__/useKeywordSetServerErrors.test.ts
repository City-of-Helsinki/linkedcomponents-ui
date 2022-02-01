/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from '@apollo/client';
import { act, renderHook } from '@testing-library/react-hooks';

import useKeywordSetServerErrors from '../useKeywordSetServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => useKeywordSetServerErrors());
  // Test the initial state of the request
  expect(result.current.serverErrorItems).toEqual([]);
  return { result };
};

it('should set server error items', async () => {
  const { result } = getHookWrapper();
  const callbackFn = jest.fn();

  const error = new ApolloError({
    networkError: { result: { name: ['The name must be specified.'] } } as any,
  });

  act(() => result.current.showServerErrors({ callbackFn, error }));

  expect(result.current.serverErrorItems).toEqual([
    { label: 'Nimi', message: 'Nimi on pakollinen.' },
  ]);
  expect(callbackFn).toBeCalled();
});

it('should return server error items when result is array', () => {
  const { result } = getHookWrapper();
  const error = new ApolloError({
    networkError: {
      result: [
        {
          detail: 'Metodi "POST" ei ole sallittu.',
          name: ['Tämän kentän arvo ei voi olla "null".'],
        },
      ],
    } as any,
  });

  act(() => result.current.showServerErrors({ error }));

  expect(result.current.serverErrorItems).toEqual([
    { label: '', message: 'Metodi "POST" ei ole sallittu.' },
    { label: 'Nimi', message: 'Tämän kentän arvo ei voi olla "null".' },
  ]);
});

it('should return server error items when result is array of string', () => {
  const { result } = getHookWrapper();
  const error = new ApolloError({
    networkError: { result: ['Could not find all objects to update.'] } as any,
  });

  act(() => result.current.showServerErrors({ error }));

  expect(result.current.serverErrorItems).toEqual([
    { label: '', message: 'Kaikkia päivitettäviä objekteja ei löytynyt.' },
  ]);
});
