import { renderHook } from '@testing-library/react';

import {
  shouldSetGenericServerErrors,
  shouldSetServerErrors,
} from '../../../../utils/testUtils';
import usePriceGroupServerErrors from '../usePriceGroupServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => usePriceGroupServerErrors());
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

  shouldSetServerErrors(result, { description: ['Kuvaus on pakollinen.'] }, [
    { label: 'Kuvaus', message: 'Kuvaus on pakollinen.' },
  ]);
});
