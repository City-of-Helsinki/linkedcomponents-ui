import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import SearchInput, { SearchInputProps } from '../SearchInput';

configure({ defaultHidden: true });

const label = 'Enter search value';

const defaultProps: SearchInputProps = {
  label,
  onSearch: jest.fn(),
  setValue: jest.fn(),
  value: '',
};

const renderComponent = (props?: Partial<SearchInputProps>) =>
  render(<SearchInput {...defaultProps} {...props} />);

test('should render component with default texts', async () => {
  renderComponent({ value: '' });

  screen.getByRole('textbox', { name: label });
  screen.getByRole('button', { name: 'Search' });
  expect(
    screen.queryByRole('button', { name: 'Clear' })
  ).not.toBeInTheDocument();
});

test('should clear search value', async () => {
  const searchValue = 'test';
  const setValue = jest.fn();
  renderComponent({ setValue, value: searchValue });

  const searchInput = screen.getByRole('textbox', { name: label });
  expect(searchInput).toHaveValue(searchValue);

  const clearButton = screen.getByRole('button', { name: 'Clear' });
  userEvent.click(clearButton);

  expect(setValue).toBeCalledWith('');
});

test('should call onSearch when clicking search button', async () => {
  const searchValue = 'test';
  const onSearch = jest.fn();
  renderComponent({ onSearch, value: searchValue });

  const searchButton = screen.getByRole('button', { name: 'Search' });
  userEvent.click(searchButton);

  expect(onSearch).toBeCalledWith(searchValue);
});

test('should call onSearch when pressing enter', async () => {
  const searchValue = 'test';
  const onSearch = jest.fn();
  renderComponent({ onSearch, value: searchValue });

  const searchInput = screen.getByRole('textbox', { name: label });
  userEvent.click(searchInput);
  userEvent.type(searchInput, '{enter}');

  expect(onSearch).toBeCalledWith(searchValue);
});
