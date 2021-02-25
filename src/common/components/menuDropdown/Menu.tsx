import classNames from 'classnames';
import React from 'react';
import { RectReadOnly } from 'react-use-measure';

import styles from './menu.module.scss';
import MenuItem, { MenuItemOptionProps } from './MenuItem';

const MENU_MIN_WIDTH = 190;

type MenuStyles = {
  minWidth?: number;
  right?: number;
  top?: number;
};

type MenuProps = React.ComponentPropsWithoutRef<'div'> & {
  ariaLabelledBy: string;
  fixedPosition: boolean;
  focusedIndex: number;
  id: string;
  items: MenuItemOptionProps[];
  menuContainerSize: RectReadOnly;
  menuOpen: boolean;
  onItemClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  setFocusedIndex: (index: number) => void;
};

export const Menu = ({
  ariaLabelledBy,
  fixedPosition,
  focusedIndex,
  id,
  items,
  menuContainerSize,
  menuOpen,
  onItemClick,
  setFocusedIndex,
  ...rest
}: MenuProps) => {
  const menuStyles: MenuStyles = React.useMemo(() => {
    const { height, right, top, width } = menuContainerSize;
    // the menu width should be at least 190px
    const minWidth = MENU_MIN_WIDTH >= width ? MENU_MIN_WIDTH : width;
    return {
      minWidth,
      right: fixedPosition ? window.innerWidth - right : undefined,
      top: fixedPosition ? height + top : undefined,
    };
  }, [fixedPosition, menuContainerSize]);

  return (
    <div
      role="region"
      aria-hidden={!menuOpen}
      aria-labelledby={ariaLabelledBy}
      id={id}
      className={classNames(styles.menu, { [styles.open]: menuOpen })}
      style={{ ...menuStyles, position: fixedPosition ? 'fixed' : 'absolute' }}
      {...rest}
    >
      {items.map(({ disabled, icon, label, onClick, title }, index) => {
        const handleClick = (event?: React.MouseEvent<HTMLElement>) => {
          event?.preventDefault();
          onClick(event);

          /* istanbul ignore else */
          if (typeof onItemClick === 'function') {
            onItemClick(event);
          }
        };
        return (
          <MenuItem
            key={index}
            disabled={disabled}
            icon={icon}
            index={index}
            isFocused={focusedIndex === index}
            label={label}
            onClick={handleClick}
            setFocusedIndex={setFocusedIndex}
            title={title}
          />
        );
      })}
    </div>
  );
};

export default Menu;
