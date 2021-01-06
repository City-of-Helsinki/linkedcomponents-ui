import { act, renderHook } from '@testing-library/react-hooks';
import i18n from 'i18next';

import useTimeFormat from '../useTimeFormat';

beforeEach(() => {
  act(() => {
    i18n.changeLanguage('fi');
  });
});

test('should return correct time format', () => {
  const { result } = renderHook(() => useTimeFormat());

  expect(result.current).toBe('HH.mm');

  act(() => {
    i18n.changeLanguage('sv');
  });

  expect(result.current).toBe('HH:mm');

  act(() => {
    i18n.changeLanguage('en');
  });

  expect(result.current).toBe('h:mm aaaa');
});

test('should return default time format', () => {
  const { result } = renderHook(() => useTimeFormat());

  act(() => {
    i18n.changeLanguage('fr');
  });

  expect(result.current).toBe('HH.mm');
});
