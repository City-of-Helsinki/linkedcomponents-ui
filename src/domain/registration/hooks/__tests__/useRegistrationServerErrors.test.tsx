/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from '@apollo/client';
import { act, renderHook } from '@testing-library/react';

import useRegistrationServerErrors from '../useRegistrationServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => useRegistrationServerErrors());
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
      result: {
        audience_min_age: ['Tämän luvun on oltava vähintään 0.'],
        audience_max_age: ['Tämän luvun on oltava vähintään 0.'],
        enrolment_end_time: [
          'End time cannot be in the past. Please set a future end time.',
        ],
        event: ['Tämän kentän arvo ei voi olla "null".'],
        maximum_attendee_capacity: ['Tämän luvun on oltava vähintään 0.'],
        minimum_attendee_capacity: ['Tämän luvun on oltava vähintään 0.'],
        waiting_list_capacity: ['Tämän luvun on oltava vähintään 0.'],
      },
    } as any,
  });

  act(() => result.current.showServerErrors({ callbackFn, error }));

  expect(result.current.serverErrorItems).toEqual([
    { label: 'Alaikäraja', message: 'Tämän luvun on oltava vähintään 0.' },
    { label: 'Yläikäraja', message: 'Tämän luvun on oltava vähintään 0.' },
    {
      label: 'Ilmoittautuminen päättyy',
      message:
        'Lopetusaika ei voi olla menneisyydessä. Määritä tuleva päättymisaika.',
    },
    {
      label: 'Tapahtuma',
      message: 'Tämän kentän arvo ei voi olla "null".',
    },
    {
      label: 'Paikkojen enimmäismäärä',
      message: 'Tämän luvun on oltava vähintään 0.',
    },
    {
      label: 'Paikkojen vähimmäismäärä',
      message: 'Tämän luvun on oltava vähintään 0.',
    },
    {
      label: 'Varasijapaikkojen lukumäärä',
      message: 'Tämän luvun on oltava vähintään 0.',
    },
  ]);
  expect(callbackFn).toBeCalled();
});
