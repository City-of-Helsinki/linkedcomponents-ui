import { renderHook } from '@testing-library/react';

import useEventListTypeOptions from '../useEventListTypeOptions';

test('should return list types in correct order', () => {
  const { result } = renderHook(() => useEventListTypeOptions());

  expect(result.current.map((options) => options.label)).toEqual([
    'Listanäkymä',
    'Korttinäkymä',
  ]);
});
