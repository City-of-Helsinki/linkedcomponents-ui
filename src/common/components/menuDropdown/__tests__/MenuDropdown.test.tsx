import { IconPen } from 'hds-react';
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
  tabKeyPressHelper,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import MenuDropdown, { MenuDropdownProps } from '../MenuDropdown';
import { MenuItemOptionProps } from '../MenuItem';

configure({ defaultHidden: true });

const renderMenuDropdown = (props: MenuDropdownProps) => {
  render(<MenuDropdown {...props} />);

  const getItemAtIndex = (index: number) =>
    screen.getByRole('button', { name: items[index].label });

  return {
    getItemAtIndex,
    getElement,
  };
};

const getElement = (key: 'menu' | 'toggleButton') => {
  switch (key) {
    case 'toggleButton':
      return screen.getByRole('button', { name: defaultProps.buttonLabel });
  }
};

const findElement = (key: 'menu' | 'toggleButton') => {
  switch (key) {
    case 'menu':
      return screen.findByRole('region', { name: defaultProps.buttonLabel });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggleButton');
  await act(async () => await user.click(toggleButton));

  await findElement('menu');
};

const menuShouldBeClosed = async () =>
  await waitFor(() =>
    expect(
      screen.queryByRole('region', { name: defaultProps.buttonLabel })
    ).not.toBeInTheDocument()
  );

const items: MenuItemOptionProps[] = [1, 2, 3, 4].map((item) => ({
  icon: <IconPen />,
  onClick: jest.fn(),
  label: `Label ${item}`,
}));

const buttonLabel = 'Select item';

const defaultProps: MenuDropdownProps = {
  buttonAriaLabel: buttonLabel,
  buttonLabel,
  items,
};

test('changes focused item correctly', async () => {
  const { getItemAtIndex } = renderMenuDropdown(defaultProps);

  await openMenu();

  arrowDownKeyPressHelper();
  expect(getItemAtIndex(0)).toHaveClass('highlighted');

  arrowDownKeyPressHelper();
  arrowDownKeyPressHelper();
  expect(getItemAtIndex(2)).toHaveClass('highlighted');

  arrowDownKeyPressHelper();
  expect(getItemAtIndex(3)).toHaveClass('highlighted');

  arrowDownKeyPressHelper();
  expect(getItemAtIndex(0)).toHaveClass('highlighted');

  arrowUpKeyPressHelper();
  expect(getItemAtIndex(3)).toHaveClass('highlighted');
});

test('should call onClick when pressing enter key', async () => {
  renderMenuDropdown(defaultProps);

  await openMenu();

  arrowDownKeyPressHelper();

  enterKeyPressHelper();

  expect(items[0].onClick).toBeCalled();
});

test('calls onClick callback correctly', async () => {
  const user = userEvent.setup();
  const { getItemAtIndex } = renderMenuDropdown(defaultProps);

  await openMenu();

  for (const [index, item] of items.entries()) {
    await act(async () => await user.click(getItemAtIndex(index)));
    expect(item.onClick).toHaveBeenCalled();
  }
});

test('menu should be closed with esc key', async () => {
  renderMenuDropdown(defaultProps);

  await openMenu();
  escKeyPressHelper();
  await menuShouldBeClosed();
});

test('menu should be open with arrow up/down key', async () => {
  renderMenuDropdown(defaultProps);

  await openMenu();

  escKeyPressHelper();
  await menuShouldBeClosed();

  arrowDownKeyPressHelper();
  await findElement('menu');

  escKeyPressHelper();
  await menuShouldBeClosed();

  arrowUpKeyPressHelper();
  await findElement('menu');
});

test('menu should be closed with teb key', async () => {
  renderMenuDropdown(defaultProps);

  await openMenu();

  tabKeyPressHelper();
  await menuShouldBeClosed();
});
