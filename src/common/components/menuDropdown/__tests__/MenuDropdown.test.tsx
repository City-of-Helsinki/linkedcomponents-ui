import { IconPen } from 'hds-react';

import {
  arrowDownKeyPressHelper,
  arrowUpKeyPressHelper,
  configure,
  enterKeyPressHelper,
  escKeyPressHelper,
  openDropdownMenu,
  render,
  screen,
  tabKeyPressHelper,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import MenuDropdown, { MenuDropdownProps } from '../MenuDropdown';
import { MenuItemOptionProps } from '../types';

configure({ defaultHidden: true });

const renderMenuDropdown = (props: MenuDropdownProps) => {
  render(<MenuDropdown {...props} />);

  const getItemAtIndex = (index: number) =>
    screen.getByRole('button', { name: items[index].label });

  return { getItemAtIndex };
};

const findMenu = () =>
  screen.findByRole('region', { name: defaultProps.buttonLabel });

const menuShouldBeClosed = async () =>
  await waitFor(() =>
    expect(
      screen.queryByRole('region', { name: defaultProps.buttonLabel })
    ).not.toBeInTheDocument()
  );

const items: MenuItemOptionProps[] = [1, 2, 3, 4].map((item) => ({
  icon: <IconPen />,
  onClick: vi.fn(),
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

  await openDropdownMenu(defaultProps.buttonLabel);

  arrowDownKeyPressHelper();
  expect(getItemAtIndex(0).className).toStrictEqual(
    expect.stringContaining('highlighted')
  );

  arrowDownKeyPressHelper();
  arrowDownKeyPressHelper();
  expect(getItemAtIndex(2).className).toStrictEqual(
    expect.stringContaining('highlighted')
  );

  arrowDownKeyPressHelper();
  expect(getItemAtIndex(3).className).toStrictEqual(
    expect.stringContaining('highlighted')
  );

  arrowDownKeyPressHelper();
  expect(getItemAtIndex(0).className).toStrictEqual(
    expect.stringContaining('highlighted')
  );

  arrowUpKeyPressHelper();
  expect(getItemAtIndex(3).className).toStrictEqual(
    expect.stringContaining('highlighted')
  );
});

test('should call onClick when pressing enter key', async () => {
  renderMenuDropdown(defaultProps);

  await openDropdownMenu(defaultProps.buttonLabel);

  arrowDownKeyPressHelper();

  enterKeyPressHelper();

  expect(items[0].onClick).toBeCalled();
});

test('calls onClick callback correctly', async () => {
  const user = userEvent.setup();
  const { getItemAtIndex } = renderMenuDropdown(defaultProps);

  await openDropdownMenu(defaultProps.buttonLabel);

  for (const [index, item] of items.entries()) {
    await user.click(getItemAtIndex(index));
    expect(item.onClick).toHaveBeenCalled();
  }
});

test('menu should be closed with esc key', async () => {
  renderMenuDropdown(defaultProps);

  await openDropdownMenu(defaultProps.buttonLabel);
  escKeyPressHelper();
  await menuShouldBeClosed();
});

test('menu should be open with arrow up/down key', async () => {
  renderMenuDropdown(defaultProps);

  await openDropdownMenu(defaultProps.buttonLabel);

  escKeyPressHelper();
  await menuShouldBeClosed();

  arrowDownKeyPressHelper();
  await findMenu();

  escKeyPressHelper();
  await menuShouldBeClosed();

  arrowUpKeyPressHelper();
  await findMenu();
});

test('menu should be closed with teb key', async () => {
  renderMenuDropdown(defaultProps);

  await openDropdownMenu(defaultProps.buttonLabel);

  tabKeyPressHelper();
  await menuShouldBeClosed();
});
