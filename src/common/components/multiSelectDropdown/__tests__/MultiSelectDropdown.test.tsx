import React from 'react';

import {
  act,
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
  { label: 'Option1', value: 'option1' },
  { label: 'Option2', value: 'option2' },
  { label: 'Option3', value: 'option3' },
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

const findElement = (key: 'clearButton' | 'searchInput') => {
  switch (key) {
    case 'clearButton':
      return screen.getByRole('button', { name: clearButtonLabel });
    case 'searchInput':
      return screen.findByPlaceholderText(searchPlaceholder);
  }
};

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

const renderComponentWithOpenMenu = async (
  props?: Partial<MultiselectDropdownProps>
) => {
  const user = userEvent.setup();
  renderComponent(props);

  const toggleButton = getElement('toggleButton');
  await act(async () => await user.click(toggleButton));

  await findElement('clearButton');
};

const renderComponentWithClosedMenu = async (
  props?: Partial<MultiselectDropdownProps>
) => {
  renderComponent(props);

  const toggleButton = getElement('toggleButton');
  toggleButton.focus();
  await waitFor(() => expect(toggleButton).toHaveFocus());
};

test('should not show search input field', async () => {
  await renderComponentWithOpenMenu({ showSearch: false });

  expect(
    screen.queryByPlaceholderText(searchPlaceholder)
  ).not.toBeInTheDocument();
  getElement('clearButton');
});

test('should open dropdown menu', async () => {
  await renderComponentWithOpenMenu();

  options.forEach(({ label }) => {
    screen.getByRole('checkbox', { name: label });
  });

  getElement('searchInput');
  getElement('clearButton');
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

test('should close menu with esc key', async () => {
  await renderComponentWithOpenMenu();

  const searchInput = getElement('searchInput');

  escKeyPressHelper();

  expect(searchInput).not.toBeInTheDocument();
});

test('should filter options', async () => {
  const user = userEvent.setup();
  await renderComponentWithOpenMenu();

  options.forEach(({ label }) => screen.getByRole('checkbox', { name: label }));

  const searchInput = getElement('searchInput');
  await act(async () => await user.type(searchInput, options[0].label));

  const optionsNotVisible = [options[1].label, options[2].label];
  for (const optionLabel in optionsNotVisible) {
    await waitFor(() =>
      expect(
        screen.queryByRole('checkbox', { name: optionLabel })
      ).not.toBeInTheDocument()
    );
  }

  screen.getByRole('checkbox', { name: options[0].label });
});

test('should call onChange', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  await renderComponentWithOpenMenu({ onChange });

  for (const option of options) {
    const checkbox = screen.getByRole('checkbox', { name: option.label });
    await act(async () => await user.click(checkbox));

    expect(onChange).toBeCalledWith([option]);
  }
});

test('should uncheck option', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  await renderComponentWithOpenMenu({ onChange, value: [options[0]] });

  const checkbox = screen.getByRole('checkbox', { name: options[0].label });
  await act(async () => await user.click(checkbox));

  expect(onChange).toBeCalledWith([]);
});

test('should call onChange when pressing enter', async () => {
  const onChange = jest.fn();
  await renderComponentWithClosedMenu({ onChange });

  arrowDownKeyPressHelper();
  const checkbox = await screen.findByRole('checkbox', {
    name: options[0].label,
  });
  enterKeyPressHelper(checkbox);

  expect(onChange).toBeCalledWith([options[0]]);
});

test('should clear value', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  await renderComponentWithOpenMenu({ onChange, value: [options[0]] });

  const clearButton = getElement('clearButton');
  await act(async () => await user.click(clearButton));

  expect(onChange).toBeCalledWith([]);
});

test('should show value text correctly', () => {
  renderComponent({ value: [options[0], options[1]] });

  screen.getByText('Option1 + 1');
});
