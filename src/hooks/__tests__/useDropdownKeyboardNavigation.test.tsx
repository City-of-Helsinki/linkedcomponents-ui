import { fireEvent } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';

import useDropdownKeyboardNavigation, {
  KeyboardNavigationProps,
} from '../useDropdownKeyboardNavigation';

function renderNavigationHook(
  props: Pick<
    KeyboardNavigationProps,
    'initialFocusedIndex' | 'listLength' | 'onKeyDown'
  >
) {
  const div = document.createElement('div');
  div.setAttribute('tabIndex', '0');
  document.body.appendChild(div);

  const { result, ...rest } = renderHook(() =>
    useDropdownKeyboardNavigation({ ...props, container: { current: div } })
  );

  result.current.setup();
  div.focus();

  const keyDown = (key: string) => {
    act(() => {
      result.current.teardown();
      result.current.setup();
      fireEvent.keyDown(div, { key });
    });
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
}

describe('useDropdownKeyboardNavigation', () => {
  it('changes focusedIndex correctly', async () => {
    const { result, arrowDown, arrowUp } = renderNavigationHook({
      listLength: 4,
    });

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

  it('changes focusedIndex correctly when initialFocusedIndex is given and arrow down is pressed', () => {
    const { result, arrowDown } = renderNavigationHook({
      listLength: 4,
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
      listLength: 4,
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
      listLength: 4,
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
      listLength: 4,
      initialFocusedIndex: 0,
      onKeyDown,
    });

    arrowDown();

    expect(onKeyDown).toBeCalled();
  });
});
