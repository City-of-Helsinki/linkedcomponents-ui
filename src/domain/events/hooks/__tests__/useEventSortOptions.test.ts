import { renderHook } from '@testing-library/react';

import useEventSortOptions from '../useEventSortOptions';

test('should return sort options in correct order', () => {
  const { result } = renderHook(() => useEventSortOptions());

  expect(result.current.map((options) => options.label)).toEqual([
    'Loppuaika, nouseva',
    'Loppuaika, laskeva',
    'Viimeksi muokattu, nouseva',
    'Viimeksi muokattu, laskeva',
    'Nimi, nouseva',
    'Nimi, laskeva',
    'Alkuaika, nouseva',
    'Alkuaika, laskeva',
  ]);
});
