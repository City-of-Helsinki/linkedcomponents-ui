import classNames from 'classnames';
import React from 'react';

import styles from './menu.module.scss';
import MenuItem, { MenuItemOptionProps } from './MenuItem';

type MenuProps = React.ComponentPropsWithoutRef<'div'> & {
  ariaLabelledBy: string;
  focusedIndex: number;
  id: string;
  items: MenuItemOptionProps[];
  menuOpen: boolean;
  setFocusedIndex: (index: number) => void;
};

export const Menu = ({
  ariaLabelledBy,
  focusedIndex,
  id,
  items,
  menuOpen,
  setFocusedIndex,
  ...rest
}: MenuProps) => {
  return (
    <div
      role="region"
      aria-hidden={!menuOpen}
      aria-labelledby={ariaLabelledBy}
      id={id}
      className={classNames(styles.menu, { [styles.open]: menuOpen })}
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
