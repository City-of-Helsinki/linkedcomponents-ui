import { renderHook } from '@testing-library/react';

import {
  shouldSetGenericServerErrors,
  shouldSetServerErrors,
} from '../../../../utils/testUtils';
import useImageServerErrors from '../useImageServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => useImageServerErrors());
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
    [{ label: 'Kuvateksti', message: 'Nimi on pakollinen.' }]
  );
});
