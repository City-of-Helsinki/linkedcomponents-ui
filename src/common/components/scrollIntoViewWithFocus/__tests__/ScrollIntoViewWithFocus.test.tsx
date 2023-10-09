import { render } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import ScrollIntoViewWithFocus from '../ScrollIntoViewWithFocus';

it('should scroll to component when focused', async () => {
  const scrollIntoViewMock = vi.fn();

  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  render(
    <ScrollIntoViewWithFocus isFocused={true}>
      <span>CHILDREN</span>
    </ScrollIntoViewWithFocus>
  );

  expect(scrollIntoViewMock).toBeCalledWith({
    block: 'nearest',
    inline: 'nearest',
  });
});
