import { renderHook } from '@testing-library/react';

import useEventTypeOptions from '../useEventTypeOptions';

const getHookWrapper = () => renderHook(() => useEventTypeOptions());

test('should return event type options', async () => {
  const { result } = getHookWrapper();

  expect(result.current).toEqual([
    { label: 'Tapahtuma', value: 'general' },
    { label: 'Kurssi', value: 'course' },
    { label: 'Vapaaehtoistehtävä', value: 'volunteering' },
  ]);
});
