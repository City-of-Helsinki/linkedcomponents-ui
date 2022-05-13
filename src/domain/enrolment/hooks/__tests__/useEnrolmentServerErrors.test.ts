/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from '@apollo/client';
import { act, renderHook } from '@testing-library/react';

import useEnrolmentServerErrors from '../useEnrolmentServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => useEnrolmentServerErrors());
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
        city: ['Tämän kentän arvo ei voi olla "null".'],
        detail: 'The participant is too old.',
        name: ['The name must be specified.'],
        non_field_errors: [
          'Kenttien email, registration tulee muodostaa uniikki joukko.',
          'Kenttien phone_number, registration tulee muodostaa uniikki joukko.',
        ],
      },
    } as any,
  });

  act(() => result.current.showServerErrors({ callbackFn, error }));

  expect(result.current.serverErrorItems).toEqual([
    { label: 'Kaupunki', message: 'Tämän kentän arvo ei voi olla "null".' },
    { label: '', message: 'Osallistuja on liian vanha.' },
    { label: 'Nimi', message: 'Nimi on pakollinen.' },
    { label: '', message: 'Sähköpostiosoitteella on jo ilmoittautuminen.' },
  ]);
  expect(callbackFn).toBeCalled();
});
