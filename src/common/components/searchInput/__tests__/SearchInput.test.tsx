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

const getElement = (key: 'clearButton' | 'input' | 'searchButton') => {
  switch (key) {
    case 'clearButton':
      return screen.getByRole('button', { name: 'Tyhjennä' });
    case 'input':
      return screen.getByRole('searchbox', { name: label });
    case 'searchButton':
      return screen.getByRole('button', { name: 'Etsi' });
  }
};

test('should render component with default texts', async () => {
  renderComponent({ value: '' });

  getElement('input');
  getElement('searchButton');
  expect(
    screen.queryByRole('button', { name: 'Tyhjennä' })
  ).not.toBeInTheDocument();
});

test('should clear search value', async () => {
  const searchValue = 'test';
  const setValue = jest.fn();
  renderComponent({ setValue, value: searchValue });

  const searchInput = getElement('input');
  expect(searchInput).toHaveValue(searchValue);

  const clearButton = getElement('clearButton');
  userEvent.click(clearButton);

  expect(setValue).toBeCalledWith('');
});

test('should call onSearch when clicking search button', async () => {
  const searchValue = 'test';
  const onSearch = jest.fn();
  renderComponent({ onSearch, value: searchValue });

  const searchButton = getElement('searchButton');
  userEvent.click(searchButton);

  expect(onSearch).toBeCalledWith(searchValue);
});

test('should call onSearch when pressing enter', async () => {
  const searchValue = 'test';
  const onSearch = jest.fn();
  renderComponent({ onSearch, value: searchValue });

  const searchInput = getElement('input');
  userEvent.click(searchInput);
  userEvent.type(searchInput, '{enter}');

  expect(onSearch).toBeCalledWith(searchValue);
});
