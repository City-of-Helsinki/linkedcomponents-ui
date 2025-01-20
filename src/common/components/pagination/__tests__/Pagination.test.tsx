import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { configure, render, screen } from '../../../../utils/testUtils';
import Pagination, { PaginationProps } from '../Pagination';

configure({ defaultHidden: true });

const defaultProps: PaginationProps = {
  pageCount: 10,
  pageHref: () => '',
  pageIndex: 0,
  onChange: vi.fn(),
};

const getElement = (key: 'next' | 'previous') => {
  switch (key) {
    case 'next':
      return screen.getByRole('button', { name: 'Seuraava' });
    case 'previous':
      return screen.getByRole('button', { name: 'Edellinen' });
  }
};

const renderComponent = (props?: Partial<PaginationProps>) =>
  render(<Pagination {...defaultProps} {...props} />);

test('previous button should be disabled', async () => {
  renderComponent({ pageIndex: 0 });
  const previousButton = getElement('previous');

  expect(previousButton).toBeDisabled();
});

test('should call onChange when clicking previous button', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  renderComponent({ pageIndex: 1, onChange });

  const previousButton = getElement('previous');
  await user.click(previousButton);

  expect(onChange).toBeCalledWith(expect.objectContaining({}), 0);
});

test('next button should be disabled', async () => {
  renderComponent({ pageIndex: 9 });
  const nextButton = getElement('next');

  expect(nextButton).toBeDisabled();
});

test('should call onChange when clicking next button', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();

  renderComponent({ pageIndex: 8, onChange });

  const nextButton = getElement('next');
  await user.click(nextButton);

  expect(onChange).toBeCalledWith(expect.objectContaining({}), 9);
});

test('should call onChange when clicking page link', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();
  renderComponent({ pageIndex: 0, onChange });

  const links = screen.getAllByRole('listitem');
  const page2Link = links[1].querySelector('a') as HTMLAnchorElement;

  await user.click(page2Link);

  expect(onChange).toBeCalledWith(expect.objectContaining({}), 1);
});
