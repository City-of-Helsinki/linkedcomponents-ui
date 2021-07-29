/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from '@apollo/client';
import { act, renderHook } from '@testing-library/react-hooks';

import { EVENT_TYPE } from '../../constants';
import useEventServerErrors from '../useEventServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => useEventServerErrors());
  // Test the initial state of the request
  expect(result.current.serverErrorItems).toEqual([]);
  return { result };
};

it('should set server error items', async () => {
  const { result } = getHookWrapper();

  const error = new ApolloError({
    networkError: {
      result: {
        audience_min_age: ['Tämän luvun on oltava vähintään 0.'],
        audience_max_age: ['Tämän luvun on oltava vähintään 0.'],
        description: {
          fi: 'This field must be specified before an event is published.',
        },
        end_time: [
          'End time cannot be in the past. Please set a future end time.',
        ],
        external_links: [{ link: ['Syötä oikea URL-osoite.'] }],
        keywords: [
          'This field must be specified before an event is published.',
        ],
        location: [
          'This field must be specified before an event is published.',
        ],
        maximum_attendee_capacity: ['Tämän luvun on oltava vähintään 0.'],
        minimum_attendee_capacity: ['Tämän luvun on oltava vähintään 0.'],
        name: ['The name must be specified.'],
        offers: ['Price info must be specified before an event is published.'],
        short_description: {
          fi: 'Short description length must be 160 characters or less',
        },
        start_time: [
          'This field must be specified before an event is published.',
        ],
        videos: [
          {
            name: ['Tämä kenttä ei voi olla tyhjä.'],
            url: ['Syötä oikea URL-osoite.'],
          },
        ],
        dummy1: { error: ['Not translated error message.'] },
        dummy2: { error: 'Not translated error message.' },
        dummy3: [{ error: 'Not translated error message.' }],
        dummy4: [{ error: ['Not translated error message.'] }],
      },
    } as any,
  });

  act(() =>
    result.current.showServerErrors({
      eventType: EVENT_TYPE.General,
      error,
    })
  );

  expect(result.current.serverErrorItems).toEqual([
    { label: 'Alaikäraja', message: 'Tämän luvun on oltava vähintään 0.' },
    { label: 'Yläikäraja', message: 'Tämän luvun on oltava vähintään 0.' },
    {
      label: 'Tapahtuman kuvaus suomeksi',
      message: 'Tämä kenttä on määritettävä ennen tapahtuman julkaisemista.',
    },
    {
      label: 'Tapahtuma päättyy',
      message:
        'Lopetusaika ei voi olla menneisyydessä. Määritä tuleva päättymisaika.',
    },
    {
      label: 'Tapahtuma sosiaalisessa mediassa',
      message: 'Syötä oikea URL-osoite.',
    },
    {
      label: 'Avainsanahaku',
      message: 'Tämä kenttä on määritettävä ennen tapahtuman julkaisemista.',
    },
    {
      label: 'Paikka',
      message: 'Tämä kenttä on määritettävä ennen tapahtuman julkaisemista.',
    },
    {
      label: 'Enimmäisosallistujamäärä',
      message: 'Tämän luvun on oltava vähintään 0.',
    },
    {
      label: 'Vähimmäisosallistujamäärä',
      message: 'Tämän luvun on oltava vähintään 0.',
    },
    { label: 'Tapahtuman otsikko ', message: 'Nimi on pakollinen.' },
    {
      label: 'Tapahtuman hintatiedot',
      message: 'Hintatiedot on määritettävä ennen tapahtuman julkaisemista.',
    },
    {
      label: 'Lyhyt kuvaus suomeksi (korkeintaan 160 merkkiä)',
      message: 'Lyhyen kuvauksen pituus saa olla enintään 160 merkkiä',
    },
    {
      label: 'Tapahtuma alkaa',
      message: 'Tämä kenttä on määritettävä ennen tapahtuman julkaisemista.',
    },
    { label: 'Videon nimi', message: 'Tämä kenttä ei voi olla tyhjä.' },
    { label: 'Videon URL-osoite', message: 'Syötä oikea URL-osoite.' },
    {
      label: 'event.form.labelDummy1',
      message: 'Not translated error message.',
    },
    {
      label: 'event.form.labelDummy2',
      message: 'Not translated error message.',
    },
    {
      label: 'event.form.labelDummy3',
      message: 'Not translated error message.',
    },
    {
      label: 'event.form.labelDummy4',
      message: 'Not translated error message.',
    },
  ]);
});

it('should return server error items when result is array', () => {
  const { result } = getHookWrapper();
  const callbackFn = jest.fn();
  const error = new ApolloError({
    networkError: {
      result: [
        { name: ['The name must be specified.'] },
        { name: ['The name must be specified.'] },
        { name: ['The name must be specified.'] },
        { name: ['The name must be specified.'] },
      ],
    } as any,
  });

  act(() =>
    result.current.showServerErrors({
      callbackFn,
      eventType: EVENT_TYPE.General,
      error,
    })
  );

  expect(result.current.serverErrorItems).toEqual([
    { label: 'Tapahtuman otsikko ', message: 'Nimi on pakollinen.' },
    { label: 'Tapahtuman otsikko ', message: 'Nimi on pakollinen.' },
    { label: 'Tapahtuman otsikko ', message: 'Nimi on pakollinen.' },
    { label: 'Tapahtuman otsikko ', message: 'Nimi on pakollinen.' },
  ]);
  expect(callbackFn).toBeCalled();
});

it('should return server error items when result is array of string', () => {
  const { result } = getHookWrapper();
  const callbackFn = jest.fn();
  const error = new ApolloError({
    networkError: { result: ['Could not find all objects to update.'] } as any,
  });

  act(() =>
    result.current.showServerErrors({
      callbackFn,
      eventType: EVENT_TYPE.General,
      error,
    })
  );

  expect(result.current.serverErrorItems).toEqual([
    { label: '', message: 'Kaikkia päivitettäviä objekteja ei löytynyt.' },
  ]);
  expect(callbackFn).toBeCalled();
});
