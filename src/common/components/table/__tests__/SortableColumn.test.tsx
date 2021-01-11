import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import SortableColumn, { SortableColumnProps } from '../SortableColumn';

const defaultProps: SortableColumnProps = {
  label: 'Column label',
  onClick: jest.fn(),
  sort: 'key',
  sortKey: 'key',
};

const renderComponent = (props?: Partial<SortableColumnProps>) =>
  render(
    <table>
      <thead>
        <tr>
          <SortableColumn {...defaultProps} {...props} />
        </tr>
      </thead>
    </table>
  );

test('sort order should be ascending', () => {
  renderComponent();

  const column = screen.getByRole('columnheader', { name: defaultProps.label });
  expect(column.getAttribute('aria-sort')).toBe('ascending');
});

test('sort order should be descending', () => {
  renderComponent({ sort: '-key' });

  const column = screen.getByRole('columnheader', { name: defaultProps.label });
  expect(column.getAttribute('aria-sort')).toBe('descending');
});

test('should call onClick function when clicking column', () => {
  const onClick = jest.fn();
  renderComponent({ onClick });

  userEvent.click(screen.getByRole('button', { name: defaultProps.label }));
  expect(onClick).toBeCalledWith('-key');
});
