import { fireEvent, renderHook } from '@testing-library/react';

import useDropdownKeyboardNavigation, {
  KeyboardNavigationProps,
} from '../useDropdownKeyboardNavigation';

const defaultProps: Pick<
  KeyboardNavigationProps,
  'initialFocusedIndex' | 'listLength' | 'onKeyDown'
> = {
  listLength: 4,
};

const renderNavigationHook = (props?: Partial<KeyboardNavigationProps>) => {
  const div = document.createElement('div');
  div.setAttribute('tabIndex', '0');
  document.body.appendChild(div);

  const { result, ...rest } = renderHook(() =>
    useDropdownKeyboardNavigation({
      ...defaultProps,
      container: { current: div },
      ...props,
    })
  );

  result.current.setup();
  div.focus();

  const keyDown = (key: string) => {
    result.current.teardown();
    result.current.setup();
    fireEvent.keyDown(div, { key });
  };

  const arrowDown = () => {
    keyDown('ArrowDown');
  };

  const arrowUp = () => {
    keyDown('ArrowUp');
  };

  const esc = () => {
    keyDown('Escape');
  };

  return { result, ...rest, arrowDown, arrowUp, esc };
};

describe('useDropdownKeyboardNavigation', () => {
  it('changes focusedIndex correctly', async () => {
    const { result, arrowDown, arrowUp } = renderNavigationHook();

    arrowDown();

    expect(result.current.focusedIndex).toBe(0);

    arrowDown();
    arrowDown();

    expect(result.current.focusedIndex).toBe(2);

    arrowDown();

    expect(result.current.focusedIndex).toBe(3);

    arrowDown();

    expect(result.current.focusedIndex).toBe(0);

    arrowUp();

    expect(result.current.focusedIndex).toBe(3);
  });

  it('changes focusedIndex correctly when some items are disabled', async () => {
    const { result, arrowDown, arrowUp } = renderNavigationHook({
      disabledIndices: [2],
    });

    arrowDown();

    expect(result.current.focusedIndex).toBe(0);

    arrowDown();
    arrowDown();

    expect(result.current.focusedIndex).toBe(3);

    arrowUp();

    expect(result.current.focusedIndex).toBe(1);
  });

  it('changes focusedIndex correctly when initialFocusedIndex is given and arrow down is pressed', () => {
    const { result, arrowDown } = renderNavigationHook({
      initialFocusedIndex: 2,
    });

    arrowDown();

    expect(result.current.focusedIndex).toBe(2);

    arrowDown();

    expect(result.current.focusedIndex).toBe(3);

    arrowDown();

    expect(result.current.focusedIndex).toBe(0);
  });

  it('changes focusedIndex correctly when initialFocusedIndex is given and arrow up is pressed', () => {
    const { result, arrowUp } = renderNavigationHook({
      initialFocusedIndex: 2,
    });

    arrowUp();

    expect(result.current.focusedIndex).toBe(1);

    arrowUp();

    expect(result.current.focusedIndex).toBe(0);

    arrowUp();

    expect(result.current.focusedIndex).toBe(3);
  });

  it('resets focusedIndex when esc key is pressed', () => {
    const { result, arrowDown, esc } = renderNavigationHook({
      initialFocusedIndex: 0,
    });

    arrowDown();
    arrowDown();

    expect(result.current.focusedIndex).toBe(1);

    esc();

    expect(result.current.focusedIndex).toBe(-1);
  });

  it('should call onKeyDown', () => {
    const onKeyDown = jest.fn();
    const { arrowDown } = renderNavigationHook({
      initialFocusedIndex: 0,
      onKeyDown,
    });

    arrowDown();

    expect(onKeyDown).toBeCalled();
  });
});
