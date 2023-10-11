import { renderHook, waitFor } from '@testing-library/react';

import useShowPlaceholderImage from '../useShowPlaceholderImage';

const render = (url: string) => renderHook(() => useShowPlaceholderImage(url));

describe('useShowPlaceholderImage', () => {
  test('should return false if image is loaded', async () => {
    let cbCalled = false;
    global.Image = class {
      onload: () => void;

      constructor() {
        this.onload = vi.fn();
        setTimeout(() => {
          this.onload();
          cbCalled = true;
        });
      }
    } as unknown as new () => HTMLImageElement;

    const { result } = render('http://test-url.com');

    await waitFor(() => expect(cbCalled).toBe(true));
    expect(result.current).toEqual(false);
  });

  test('should return true if loading image fails', async () => {
    let cbCalled = false;
    global.Image = class {
      onerror: () => void;

      constructor() {
        this.onerror = vi.fn();
        setTimeout(() => {
          this.onerror();
          cbCalled = true;
        });
      }
    } as unknown as new () => HTMLImageElement;

    const { result } = render('http://test-url.com');

    await waitFor(() => expect(cbCalled).toBe(true));
    expect(result.current).toEqual(true);
  });

  test('should return true if url is empty', async () => {
    const { result } = render('');

    expect(result.current).toEqual(true);
  });
});
