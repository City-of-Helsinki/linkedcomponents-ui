import { act, renderHook } from '@testing-library/react';

import useWindowSize from '../useWindowSize';

test('should return window size', async () => {
  global.innerWidth = 500;
  global.innerHeight = 800;
  const { result } = renderHook(() => useWindowSize());

  expect(result.current).toEqual({ height: 800, width: 500 });

  act(() => {
    global.innerWidth = 600;
    global.innerHeight = 900;

    // Trigger the window resize event.
    global.dispatchEvent(new Event('resize'));
  });

  expect(result.current).toEqual({ height: 900, width: 600 });
});
