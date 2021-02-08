import classNames from 'classnames';
import React from 'react';
import { RectReadOnly } from 'react-use-measure';

import styles from './menu.module.scss';
import MenuItem, { MenuItemOptionProps } from './MenuItem';

const MENU_MIN_WIDTH = 190;

type MenuStyles = {
  minWidth?: number;
};

type MenuProps = React.ComponentPropsWithoutRef<'div'> & {
  ariaLabelledBy: string;
  focusedIndex: number;
  id: string;
  items: MenuItemOptionProps[];
  menuContainerSize: RectReadOnly;
  menuOpen: boolean;
  setFocusedIndex: (index: number) => void;
};

export const Menu = ({
  ariaLabelledBy,
  focusedIndex,
  id,
  items,
  menuContainerSize,
  menuOpen,
  setFocusedIndex,
  ...rest
}: MenuProps) => {
  const [menuStyles, setMenuStyles] = React.useState<MenuStyles>({});

  React.useEffect(() => {
    const { width = 0 } = menuContainerSize;
    // the menu width should be at least 190px
    const minWidth = MENU_MIN_WIDTH >= width ? MENU_MIN_WIDTH : width;
    setMenuStyles({ minWidth });
  }, [menuContainerSize]);
  return (
    <div
      role="region"
      aria-hidden={!menuOpen}
      aria-labelledby={ariaLabelledBy}
      id={id}
      className={classNames(styles.menu, { [styles.open]: menuOpen })}
      style={menuStyles}
      {...rest}
    >
      {items.map(({ disabled, icon, label, onClick, title }, index) => {
        return (
          <MenuItem
            key={index}
            disabled={disabled}
            icon={icon}
            index={index}
            isFocused={focusedIndex === index}
            label={label}
            onClick={onClick}
            setFocusedIndex={setFocusedIndex}
            title={title}
          />
        );
      })}
    </div>
  );
};

export default Menu;
