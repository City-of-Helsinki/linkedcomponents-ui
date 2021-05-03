import React from 'react';

import {
  arrowDownKeyPressHelper,
  arrowUpKeyPressHelper,
  configure,
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

configure({ defaultHidden: true });

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

const getElement = (key: 'clearButton' | 'searchInput' | 'toggleButton') => {
  switch (key) {
    case 'clearButton':
      return screen.getByRole('button', { name: clearButtonLabel });
    case 'searchInput':
      return screen.getByPlaceholderText(searchPlaceholder);
    case 'toggleButton':
      return screen.getByRole('button', { name: toggleButtonLabel });
  }
};

const renderComponentWithOpenMenu = (
  props?: Partial<MultiselectDropdownProps>
) => {
  renderComponent(props);

  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);

  getElement('clearButton');
};

const renderComponentWithClosedMenu = (
  props?: Partial<MultiselectDropdownProps>
) => {
  renderComponent(props);

  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);

  getElement('searchInput');

  escKeyPressHelper();
  expect(
    screen.queryByPlaceholderText(searchPlaceholder)
  ).not.toBeInTheDocument();
};

test('should not show search input field', () => {
  renderComponentWithOpenMenu({ showSearch: false });

  expect(
    screen.queryByPlaceholderText(searchPlaceholder)
  ).not.toBeInTheDocument();
  getElement('clearButton');
});

test('should open dropdown menu', () => {
  renderComponentWithOpenMenu();

  options.forEach(({ label }) => {
    screen.getByRole('checkbox', { name: label });
  });

  getElement('searchInput');
  getElement('clearButton');
});

test('should open menu with arrow down key', () => {
  renderComponentWithClosedMenu();

  arrowDownKeyPressHelper();

  getElement('searchInput');
});

test('should open menu with arrow up key', () => {
  renderComponentWithClosedMenu();

  arrowUpKeyPressHelper();

  getElement('searchInput');
});

test('should filter options', async () => {
  renderComponentWithOpenMenu();

  options.forEach(({ label }) => {
    screen.getByRole('checkbox', { name: label });
  });

  const searchInput = getElement('searchInput');
  userEvent.type(searchInput, options[0].label);

  const optionsNotVisible = [options[1].label, options[2].label];
  for (const optionLabel in optionsNotVisible) {
    await waitFor(() => {
      expect(
        screen.queryByRole('checkbox', { name: optionLabel })
      ).not.toBeInTheDocument();
    });
  }

  screen.getByRole('checkbox', { name: options[0].label });
});

test('should call onChange', () => {
  const onChange = jest.fn();
  renderComponentWithOpenMenu({ onChange });

  options.forEach((option) => {
    const checkbox = screen.getByRole('checkbox', { name: option.label });
    userEvent.click(checkbox);

    expect(onChange).toBeCalledWith([option]);
  });
});

test('should uncheck option', () => {
  const onChange = jest.fn();
  renderComponentWithOpenMenu({ onChange, value: [options[0]] });

  const checkbox = screen.getByRole('checkbox', { name: options[0].label });
  userEvent.click(checkbox);

  expect(onChange).toBeCalledWith([]);
});

test('should call onChange when pressing enter', () => {
  const onChange = jest.fn();
  renderComponentWithClosedMenu({ onChange });

  arrowDownKeyPressHelper();
  const checkbox = screen.getByRole('checkbox', { name: options[0].label });
  enterKeyPressHelper(checkbox);

  expect(onChange).toBeCalledWith([options[0]]);
});

test('should clear value', () => {
  const onChange = jest.fn();
  renderComponentWithOpenMenu({ onChange, value: [options[0]] });

  const clearButton = getElement('clearButton');
  userEvent.click(clearButton);

  expect(onChange).toBeCalledWith([]);
});

test('should show value text correctly', () => {
  renderComponent({ value: [options[0], options[1]] });

  screen.getByText('Option1 + 1');
});
