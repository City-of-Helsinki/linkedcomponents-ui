import { renderHook } from '@testing-library/react';

import {
  shouldSetGenericServerErrors,
  shouldSetServerErrors,
} from '../../../../utils/testUtils';
import useOrganizationServerErrors from '../useOrganizationServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => useOrganizationServerErrors());
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

  shouldSetServerErrors(result, { name: ['The name must be specified.'] }, [
    { label: 'Nimi', message: 'Nimi on pakollinen.' },
  ]);
});

it('should set server error items if account is invalid', async () => {
  const { result } = getHookWrapper();

  shouldSetServerErrors(
    result,
    { web_store_accounts: [{ vatCode: ['Tämä kenttä ei voi olla tyhjä.'] }] },
    [{ label: 'ALV-koodi', message: 'Tämä kenttä ei voi olla tyhjä.' }]
  );
});

it('should set server error items if merchant is invalid', async () => {
  const { result } = getHookWrapper();

  shouldSetServerErrors(
    result,
    {
      web_store_merchants: [
        {
          name: ['Tämä kenttä ei voi olla tyhjä.'],
          street_address: ['Tämä kenttä ei voi olla tyhjä.'],
          zipcode: ['Tämä kenttä ei voi olla tyhjä.'],
        },
      ],
    },
    [
      { label: 'Nimi', message: 'Tämä kenttä ei voi olla tyhjä.' },
      { label: 'Katuosoite', message: 'Tämä kenttä ei voi olla tyhjä.' },
      { label: 'Postinumero', message: 'Tämä kenttä ei voi olla tyhjä.' },
    ]
  );
});
