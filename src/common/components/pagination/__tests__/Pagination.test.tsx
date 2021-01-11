import userEvent from '@testing-library/user-event';
import React from 'react';

import translations from '../../../../domain/app/i18n/fi.json';
import { configure, render, screen } from '../../../../utils/testUtils';
import Pagination, { PaginationProps } from '../Pagination';

configure({ defaultHidden: true });
const defaultProps: PaginationProps = {
  pageCount: 10,
  selectedPage: 1,
  setSelectedPage: jest.fn(),
};

const findElement = (key: 'next' | 'previous') => {
  switch (key) {
    case 'next':
      return screen.findByRole('button', {
        name: translations.common.pagination.next,
      });
    case 'previous':
      return screen.findByRole('button', {
        name: translations.common.pagination.previous,
      });
  }
};

const renderComponent = (props?: Partial<PaginationProps>) =>
  render(<Pagination {...defaultProps} {...props} />);

const testVisiblePages = (visiblePages: number[]) => {
  for (const page of visiblePages) {
    screen.getByRole('button', { name: `Sivu ${page}` });
  }
};

const testHiddenPages = (hiddenPages: number[]) => {
  for (const page of hiddenPages) {
    expect(
      screen.queryByRole('button', { name: `Sivu ${page}` })
    ).not.toBeInTheDocument();
  }
};

const testHiddenPagesButtonAmount = (length: number) => {
  expect(screen.queryAllByRole('button', { name: `...` })).toHaveLength(length);
};

test('previous button should be disabled', async () => {
  renderComponent({ selectedPage: 1 });
  const previousButton = await findElement('previous');

  expect(previousButton).toBeDisabled();
});

test('should call setSelected page when clicing previous button', async () => {
  const setSelectedPage = jest.fn();
  renderComponent({ selectedPage: 2, setSelectedPage });

  const previousButton = await findElement('previous');
  userEvent.click(previousButton);

  expect(setSelectedPage).toBeCalledWith(1);
});

test('next button should be disabled', async () => {
  renderComponent({ selectedPage: 10 });
  const nextButton = await findElement('next');

  expect(nextButton).toBeDisabled();
});

test('should call setSelected page when clicing next button', async () => {
  const setSelectedPage = jest.fn();
  renderComponent({ selectedPage: 9, setSelectedPage });

  const nextButton = await findElement('next');
  userEvent.click(nextButton);

  expect(setSelectedPage).toBeCalledWith(10);
});

test('should call setSelected page when clicing page button', async () => {
  const setSelectedPage = jest.fn();
  renderComponent({ selectedPage: 1, setSelectedPage });

  const page2Button = await screen.findByRole('button', { name: 'Sivu 2' });
  userEvent.click(page2Button);

  expect(setSelectedPage).toBeCalledWith(2);
});

test('should show correct pages when there are right hidden pages but no left hidden pages', async () => {
  renderComponent({ selectedPage: 3 });
  const visiblePages = [1, 2, 3, 4, 5, 10];
  const hiddenPages = [6, 7, 8, 9];

  testVisiblePages(visiblePages);
  testHiddenPages(hiddenPages);
  testHiddenPagesButtonAmount(1);
});

test('should show correct pages when there are left hidden pages but no right hidden pages', async () => {
  renderComponent({ selectedPage: 8 });
  const visiblePages = [1, 6, 7, 8, 9, 10];
  const hiddenPages = [2, 3, 4, 5];

  testVisiblePages(visiblePages);
  testHiddenPages(hiddenPages);
  testHiddenPagesButtonAmount(1);
});

test('should show correct pages when there are left hidden pages and right hidden pages', async () => {
  renderComponent({ selectedPage: 6 });
  const visiblePages = [1, 5, 6, 7, 10];
  const hiddenPages = [2, 3, 4, 8, 9];

  testVisiblePages(visiblePages);
  testHiddenPages(hiddenPages);
  testHiddenPagesButtonAmount(2);
});

test('should not have hidden pages', async () => {
  renderComponent({ pageCount: 2, selectedPage: 1 });
  const visiblePages = [1, 2];

  testVisiblePages(visiblePages);
  testHiddenPagesButtonAmount(0);
});
