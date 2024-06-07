import { renderHook } from '@testing-library/react';

import useEventStatusOptions from '../useEventStatusOptions';

const getHookWrapper = () => renderHook(() => useEventStatusOptions());

test('should return event status options', async () => {
  const { result } = getHookWrapper();

  expect(result.current).toEqual([
    { label: 'Aikataulutettu', value: 'EventScheduled' },
    { label: 'Aikataulutettu uudelleen', value: 'EventRescheduled' },
    { label: 'Lykätty', value: 'EventPostponed' },
    { label: 'Peruutettu', value: 'EventCancelled' },
  ]);
});
