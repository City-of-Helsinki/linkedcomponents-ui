import { renderHook } from '@testing-library/react';

import {
  shouldSetGenericServerErrors,
  shouldSetServerErrors,
} from '../../../../utils/testUtils';
import useFeedbackServerErrors from '../useFeedbackServerErrors';

const getHookWrapper = () => {
  const { result } = renderHook(() => useFeedbackServerErrors());
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
    { body: ['Arvo saa olla enintään 255 merkkiä pitkä.'] },
    [{ label: 'Viesti', message: 'Arvo saa olla enintään 255 merkkiä pitkä.' }]
  );
});
