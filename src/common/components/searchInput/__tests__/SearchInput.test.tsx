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
  onChange: jest.fn(),
  onSubmit: jest.fn(),
  value: '',
};

const renderComponent = (props?: Partial<SearchInputProps>) =>
  render(<SearchInput {...defaultProps} {...props} />);

const getElement = (key: 'clearButton' | 'input' | 'searchButton') => {
  switch (key) {
    case 'clearButton':
      return screen.getByRole('button', { name: 'Tyhjennä' });
    case 'input':
      return screen.getByRole('combobox', { name: label });
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
  const user = userEvent.setup();
  const searchValue = 'test';
  const onChange = jest.fn();

  renderComponent({ onChange, value: searchValue });

  const searchInput = getElement('input');
  expect(searchInput).toHaveValue(searchValue);

  const clearButton = getElement('clearButton');
  await user.click(clearButton);

  expect(onChange).toBeCalledWith('');
});

test('should call onSearch when clicking search button', async () => {
  const searchValue = 'test';
  const onSubmit = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onSubmit, value: searchValue });

  const searchButton = getElement('searchButton');
  await user.click(searchButton);

  expect(onSubmit).toBeCalledWith(searchValue);
});

test('should call onSearch when pressing enter', async () => {
  const searchValue = 'test';
  const onSubmit = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onSubmit, value: searchValue });

  const searchInput = getElement('input');
  await user.click(searchInput);
  await user.type(searchInput, '{enter}');

  expect(onSubmit).toBeCalledWith(searchValue);
});
