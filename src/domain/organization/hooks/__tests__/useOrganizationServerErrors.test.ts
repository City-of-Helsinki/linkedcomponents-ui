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

  await shouldSetServerErrors(
    result,
    { name: ['The name must be specified.'] },
    [{ label: 'Nimi', message: 'Nimi on pakollinen.' }]
  );
});
