/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../accessibilityUtils';

const defaultOptions = {
  highlightedIndex: 0,
  highlightedItem: null,
  inputValue: '',
  isOpen: false,
  itemToString: (s: string) => s,
  previousResultCount: 0,
  resultCount: 0,
  selectedItem: null,
};

describe('getA11ySelectionMessage', () => {
  it('should get selection message', () => {
    const selectedItem = 'Selected item';
    const t = vi.fn() as any;
    getA11ySelectionMessage({ ...defaultOptions, selectedItem }, t);

    expect(t).toBeCalledWith(
      'common.dropdownSelect.accessibility.selectionMessage',
      {
        value: 'Selected item',
      }
    );
  });
});

describe('getA11yStatusMessage', () => {
  it('should get status message', () => {
    const t = vi.fn() as any;

    expect(getA11yStatusMessage({ ...defaultOptions, isOpen: false }, t)).toBe(
      ''
    );

    getA11yStatusMessage(
      { ...defaultOptions, isOpen: true, resultCount: 0 },
      t
    );
    expect(t).toBeCalledWith('common.dropdownSelect.accessibility.noResults');

    getA11yStatusMessage(
      { ...defaultOptions, isOpen: true, resultCount: 15 },
      t
    );
    expect(t).toBeCalledWith(
      'common.dropdownSelect.accessibility.statusMessage',
      {
        count: 15,
      }
    );

    expect(
      getA11yStatusMessage(
        {
          ...defaultOptions,
          isOpen: true,
          previousResultCount: 15,
          resultCount: 15,
        },
        t
      )
    ).toBe('');
  });
});
