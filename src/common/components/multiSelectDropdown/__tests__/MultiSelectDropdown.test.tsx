import React from 'react';

import {
  arrowDownKeyPressHelper,
  arrowUpKeyPressHelper,
  enterKeyPressHelper,
  escKeyPressHelper,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import MultiSelectDropdown, {
  MultiselectDropdownProps,
} from '../MultiSelectDropdown';

const options = [
  {
    label: 'Option1',
    value: 'option1',
  },
  {
    label: 'Option2',
    value: 'option2',
  },
  {
    label: 'Option3',
    value: 'option3',
  },
];

const clearButtonLabel = 'Clear';
const searchPlaceholder = 'Search';
const toggleButtonLabel = 'Toggle';

const defaultProps: MultiselectDropdownProps = {
  clearButtonLabel,
  onChange: jest.fn(),
  options,
  searchPlaceholder,
  showSearch: true,
  toggleButtonLabel,
  value: [],
};

const renderComponent = (props?: Partial<MultiselectDropdownProps>) =>
  render(<MultiSelectDropdown {...defaultProps} {...props} />);

const findElement = (key: 'clearButton' | 'searchInput' | 'toggleButton') => {
  switch (key) {
    case 'clearButton':
      return screen.findByRole('button', { name: clearButtonLabel });
    case 'searchInput':
      return screen.findByPlaceholderText(searchPlaceholder);
    case 'toggleButton':
      return screen.findByRole('button', { name: toggleButtonLabel });
  }
};

const renderComponentWithOpenMenu = async (
  props?: Partial<MultiselectDropdownProps>
) => {
  renderComponent(props);

  const toggleButton = await findElement('toggleButton');
  userEvent.click(toggleButton);

  await findElement('clearButton');
};

const renderComponentWithClosedMenu = async (
  props?: Partial<MultiselectDropdownProps>
) => {
  renderComponent(props);

  const toggleButton = await findElement('toggleButton');
  userEvent.click(toggleButton);

  await findElement('searchInput');

  escKeyPressHelper();
  expect(
    screen.queryByPlaceholderText(searchPlaceholder)
  ).not.toBeInTheDocument();
};

test('should not show search input field', async () => {
  await renderComponentWithOpenMenu({ showSearch: false });

  expect(
    screen.queryByPlaceholderText(searchPlaceholder)
  ).not.toBeInTheDocument();
  await findElement('clearButton');
});

test('should open dropdown menu', async () => {
  await renderComponentWithOpenMenu();

  options.forEach(({ label }) => {
    screen.getByRole('checkbox', { name: label });
  });

  await findElement('searchInput');
  await findElement('clearButton');
});

test('should open menu with arrow down key', async () => {
  await renderComponentWithClosedMenu();

  arrowDownKeyPressHelper();

  await findElement('searchInput');
});

test('should open menu with arrow up key', async () => {
  await renderComponentWithClosedMenu();

  arrowUpKeyPressHelper();

  await findElement('searchInput');
});

test('should filter options', async () => {
  await renderComponentWithOpenMenu();

  options.forEach(({ label }) => {
    screen.getByRole('checkbox', { name: label });
  });

  const searchInput = await findElement('searchInput');
  userEvent.type(searchInput, options[0].label);

  const optionsNotVisible = [options[1].label, options[2].label];
  for (const optionLabel in optionsNotVisible) {
    await waitFor(() => {
      screen.queryByRole('checkbox', { name: optionLabel });
    });
  }

  screen.getByRole('checkbox', { name: options[0].label });
});

test('should call onChange', async () => {
  const onChange = jest.fn();
  await renderComponentWithOpenMenu({ onChange });

  options.forEach((option) => {
    const checkbox = screen.getByRole('checkbox', { name: option.label });
    userEvent.click(checkbox);

    expect(onChange).toBeCalledWith([option]);
  });
});

test('should uncheck option', async () => {
  const onChange = jest.fn();
  await renderComponentWithOpenMenu({ onChange, value: [options[0]] });

  const checkbox = screen.getByRole('checkbox', { name: options[0].label });
  userEvent.click(checkbox);

  expect(onChange).toBeCalledWith([]);
});

test('should call onChange when pressing enter', async () => {
  const onChange = jest.fn();
  await renderComponentWithClosedMenu({ onChange });

  arrowDownKeyPressHelper();
  const checkbox = screen.getByRole('checkbox', { name: options[0].label });
  enterKeyPressHelper(checkbox);

  expect(onChange).toBeCalledWith([options[0]]);
});

test('should clear value', async () => {
  const onChange = jest.fn();
  await renderComponentWithOpenMenu({ onChange, value: [options[0]] });

  const clearButton = await findElement('clearButton');
  userEvent.click(clearButton);

  expect(onChange).toBeCalledWith([]);
});

test('should show value text correctly', async () => {
  await renderComponent({ value: [options[0], options[1]] });

  screen.getByText('Option1 + 1');
});
