import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { RectReadOnly } from 'react-use-measure';

import MenuItem from '../menuItem/MenuItem';
import { MenuItemOptionProps } from '../types';
import styles from './menu.module.scss';

const MENU_MIN_WIDTH = 190;

export type MenuPosition = 'bottom' | 'top';

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
  menuPosition?: MenuPosition;
  onItemClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  setFocusedIndex: (index: number) => void;
};

export const Menu: React.FC<MenuProps> = ({
  ariaLabelledBy,
  fixedPosition,
  focusedIndex,
  id,
  items,
  menuContainerSize,
  menuOpen,
  menuPosition = 'bottom',
  onItemClick,
  setFocusedIndex,
  ...rest
}) => {
  const menuStyles: MenuStyles = React.useMemo(() => {
    const { height, right, top, width } = menuContainerSize;
    // the menu width should be at least 190px
    const minWidth =
      width < MENU_MIN_WIDTH
        ? MENU_MIN_WIDTH
        : /* istanbul ignore next */ width;
    return {
      minWidth,
      right: fixedPosition ? window.innerWidth - right : undefined,
      top: fixedPosition ? height + top : undefined,
    };
  }, [fixedPosition, menuContainerSize]);

  if (!menuOpen) return null;

  return (
    <div
      role="region"
      aria-hidden={!menuOpen}
      aria-labelledby={ariaLabelledBy}
      id={id}
      className={classNames(
        styles.menu,
        styles[`menuPosition${capitalize(menuPosition)}`],
        { [styles.open]: menuOpen }
      )}
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
            key={label}
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
