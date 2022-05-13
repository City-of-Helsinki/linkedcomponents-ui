import { act, configure, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import SortableColumn, { SortableColumnProps } from '../SortableColumn';

configure({ defaultHidden: true });

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

const testCases: [Partial<SortableColumnProps>, string][] = [
  [{ sort: 'key', type: 'default' }, 'ascending'],
  [{ sort: '-key', type: 'default' }, 'descending'],
  [{ sort: 'key', type: 'text' }, 'ascending'],
  [{ sort: '-key', type: 'text' }, 'descending'],
];

test.each(testCases)(
  'should set correct aria-sort with props %p, result %p',
  (props, expectedResult) => {
    renderComponent(props);

    const column = screen.getByRole('columnheader', {
      name: defaultProps.label,
    });
    expect(column.getAttribute('aria-sort')).toBe(expectedResult);
  }
);

test('should call onClick function when clicking column', async () => {
  const onClick = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onClick });

  await act(
    async () =>
      await user.click(screen.getByRole('button', { name: defaultProps.label }))
  );
  expect(onClick).toBeCalledWith('-key');
});
