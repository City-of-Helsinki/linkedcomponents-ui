import { IconPen } from 'hds-react';
import React from 'react';

import {
  arrowDownKeyPressHelper,
  arrowUpKeyPressHelper,
  configure,
  enterKeyPressHelper,
  escKeyPressHelper,
  render,
  screen,
  tabKeyPressHelper,
  userEvent,
} from '../../../../utils/testUtils';
import MenuDropdown, { MenuDropdownProps } from '../MenuDropdown';
import { MenuItemOptionProps } from '../MenuItem';

configure({ defaultHidden: true });

const renderMenuDropdown = (props: MenuDropdownProps) => {
  render(<MenuDropdown {...props} />);

  const toggleButton = screen.getByLabelText(props.buttonLabel, {
    selector: 'button',
  });

  const getMenu = () => screen.getByRole('region', { name: props.buttonLabel });
  const openMenu = () => {
    userEvent.click(toggleButton);
    getMenu();
  };

  const menuShouldBeClosed = () =>
    expect(
      screen.queryByRole('region', { name: props.buttonLabel })
    ).not.toBeInTheDocument();
  const getItemAtIndex = (index: number) =>
    screen.getByRole('button', { name: items[index].label });

  return {
    getItemAtIndex,
    getMenu,
    menuShouldBeClosed,
    openMenu,
    toggleButton,
  };
};

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
  const { getItemAtIndex, openMenu } = renderMenuDropdown(defaultProps);

  openMenu();

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
  const { openMenu } = renderMenuDropdown(defaultProps);

  openMenu();

  arrowDownKeyPressHelper();

  enterKeyPressHelper();

  expect(items[0].onClick).toBeCalled();
});

test('calls onClick callback correctly', () => {
  const { getItemAtIndex, openMenu } = renderMenuDropdown(defaultProps);

  openMenu();

  items.forEach((item, index) => {
    userEvent.click(getItemAtIndex(index));
    expect(item.onClick).toHaveBeenCalled();
  });
});

test('menu should be closed with esc key', () => {
  const { menuShouldBeClosed, openMenu } = renderMenuDropdown(defaultProps);

  openMenu();

  escKeyPressHelper();
  menuShouldBeClosed();
});

test('menu should be open with arrow up/down key', () => {
  const { getMenu, menuShouldBeClosed, openMenu } = renderMenuDropdown(
    defaultProps
  );

  openMenu();

  escKeyPressHelper();
  menuShouldBeClosed();

  arrowDownKeyPressHelper();
  getMenu();

  escKeyPressHelper();
  menuShouldBeClosed();

  arrowUpKeyPressHelper();
  getMenu();
});

test('menu should be closed with teb key', () => {
  const { menuShouldBeClosed, openMenu } = renderMenuDropdown(defaultProps);

  openMenu();

  tabKeyPressHelper();
  menuShouldBeClosed();
});
