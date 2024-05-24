import { renderHook } from '@testing-library/react';

import {
  shouldSetGenericServerErrors,
  shouldSetServerErrors,
} from '../../../../utils/testUtils';
import useRegistrationServerErrors from '../useRegistrationServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => useRegistrationServerErrors());
  // Test the initial state of the request
  expect(result.current.serverErrorItems).toEqual([]);
  return { result };
};

it('should set generic server error items', async () => {
  const { result } = getHookWrapper();

  shouldSetGenericServerErrors(result);
});

it('should set server error items', async () => {
  const { result } = getHookWrapper();

  shouldSetServerErrors(
    result,
    {
      audience_min_age: ['Tämän luvun on oltava vähintään 0.'],
      audience_max_age: ['Tämän luvun on oltava vähintään 0.'],
      enrolment_end_time: [
        'End time cannot be in the past. Please set a future end time.',
      ],
      event: ['Tämän kentän arvo ei voi olla "null".'],
      maximum_attendee_capacity: ['Tämän luvun on oltava vähintään 0.'],
      minimum_attendee_capacity: ['Tämän luvun on oltava vähintään 0.'],
      registration_merchant: {
        non_field_errors: ['Odotettiin sanakirjaa, saatiin tyyppi int.'],
      },
      registration_account: {
        non_field_errors: ['Odotettiin sanakirjaa, saatiin tyyppi int.'],
      },
      registration_user_accesses: [
        {
          is_substitute_user: [
            "The user's email domain is not one of the allowed domains for substitute users.",
          ],
        },
      ],
      registration_price_groups: [{ price: 'Kelvollinen luku vaaditaan.' }],
      waiting_list_capacity: ['Tämän luvun on oltava vähintään 0.'],
    },
    [
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
        label: 'Kauppias',
        message: 'Odotettiin sanakirjaa, saatiin tyyppi int.',
      },
      {
        label: 'Kirjanpitotili',
        message: 'Odotettiin sanakirjaa, saatiin tyyppi int.',
      },
      {
        label: 'Sijainen',
        message:
          'Käyttäjän sähköpostin verkkotunnus ei ole sallittu sijaiselle.',
      },
      {
        label: 'Hinta (€)',
        message: 'Kelvollinen luku vaaditaan.',
      },
      {
        label: 'Jonopaikkojen lukumäärä',
        message: 'Tämän luvun on oltava vähintään 0.',
      },
    ]
  );

  shouldSetServerErrors(
    result,
    {
      registration_merchant: [
        'This field is required when registration has customer groups.',
      ],
      registration_account: [
        'This field is required when registration has customer groups.',
      ],
    },
    [
      {
        label: 'Kauppias',
        message:
          'This field is required when registration has customer groups.',
      },
      {
        label: 'Kirjanpitotili',
        message:
          'This field is required when registration has customer groups.',
      },
    ]
  );
  shouldSetServerErrors(
    result,
    {
      registration_account: {
        account: ['Kenttä on pakollinen.'],
      },
      registration_merchant: {
        merchant: ['Kenttä on pakollinen.'],
      },
    },
    [
      {
        label: 'Kirjanpitotili',
        message: 'Kenttä on pakollinen.',
      },
      {
        label: 'Kauppias',
        message: 'Kenttä on pakollinen.',
      },
    ]
  );
});
