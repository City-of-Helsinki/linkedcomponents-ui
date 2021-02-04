import classNames from 'classnames';
import { css } from 'emotion';
import { ButtonProps, IconAngleDown, IconAngleUp } from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import React, { useRef, useState } from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import useDropdownKeyboardNavigation from '../../../hooks/useDropdownKeyboardNavigation';
import Button from '../button/Button';
// eslint-disable-next-line import/no-named-as-default
import Menu from './Menu';
import styles from './menuDropdown.module.scss';
import { MenuItemOptionProps } from './MenuItem';

export type MenuDropdownProps = React.PropsWithChildren<{
  button?: React.ReactElement;
  buttonAriaLabel?: string;
  buttonLabel: string;
  className?: string;
  id?: string;
  items: MenuItemOptionProps[];
}>;

const MenuDropdown = ({
  button,
  buttonAriaLabel,
  buttonLabel,
  className,
  id: _id,
  items,
}: MenuDropdownProps) => {
  const { theme } = useTheme();
  const disabledIndices = React.useMemo(
    () =>
      items.reduce(
        (acc: number[], item, i) => (item.disabled ? [...acc, i] : acc),
        []
      ),
    [items]
  );
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useRef<string>(_id || uniqueId('menu-dropdown-')).current;
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;

  const isComponentFocused = (): boolean => {
    return Boolean(containerRef.current?.contains(document.activeElement));
  };

  const {
    focusedIndex,
    setFocusedIndex,
    setup: setupKeyboardNav,
    teardown: teardownKeyoboardNav,
  } = useDropdownKeyboardNavigation({
    container: containerRef,
    disabledIndices: disabledIndices,
    listLength: items.length,
    onKeyDown: (event) => {
      /* istanbul ignore next */
      if (!isComponentFocused()) return;

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          ensureMenuIsOpen();
          break;
        case 'Escape':
          ensureMenuIsClosed();
          // setFocusToButton();
          break;
        case 'Enter':
          const item = items[focusedIndex];
          /* istanbul ignore else */
          if (menuOpen && item) {
            item.onClick();
            // setFocusToButton();
            event.preventDefault();
          }
          break;
        case 'Tab':
          ensureMenuIsClosed();
      }
    },
  });

  const ensureMenuIsClosed = () => {
    /* istanbul ignore else */
    if (menuOpen) {
      setMenuOpen(false);
      setFocusedIndex(-1);
    }
  };

  const ensureMenuIsOpen = () => {
    /* istanbul ignore else */
    if (!menuOpen) {
      setMenuOpen(true);
    }
  };

  const onDocumentClick = (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Node && containerRef.current?.contains(target))) {
      ensureMenuIsClosed();
    }
  };

  const onDocumentFocusin = (event: FocusEvent) => {
    const target = event.target;

    if (!(target instanceof Node && containerRef.current?.contains(target))) {
      ensureMenuIsClosed();
    }
  };

  React.useEffect(() => {
    setupKeyboardNav();
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('focusin', onDocumentFocusin);
    return () => {
      teardownKeyoboardNav();
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('focusin', onDocumentFocusin);
    };
  });

  const getToggleButton = () => {
    const commonProps: Partial<ButtonProps> = {
      id: buttonId,
      'aria-label': buttonAriaLabel || buttonLabel,
      'aria-haspopup': true,
      'aria-controls': menuId,
      'aria-expanded': menuOpen,
      onClick: toggleMenu,
      type: 'button',
    };
    return button ? (
      React.cloneElement(button, { ...commonProps })
    ) : (
      <Button
        {...commonProps}
        fullWidth={true}
        iconRight={
          menuOpen ? <IconAngleUp aria-hidden /> : <IconAngleDown aria-hidden />
        }
        variant={'secondary'}
      >
        <span>{buttonLabel}</span>
      </Button>
    );
  };

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setMenuOpen(!menuOpen);
  };

  return (
    <div
      ref={containerRef}
      className={classNames(
        styles.menuDropdown,
        css(theme.menuDropdown),
        className
      )}
    >
      {getToggleButton()}
      <Menu
        ariaLabelledBy={buttonId}
        focusedIndex={focusedIndex}
        id={menuId}
        items={items}
        menuOpen={menuOpen}
        setFocusedIndex={setFocusedIndex}
      />
    </div>
  );
};

export default MenuDropdown;
