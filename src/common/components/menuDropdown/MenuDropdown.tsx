import { css } from '@emotion/css';
import { ResizeObserver } from '@juggle/resize-observer';
import classNames from 'classnames';
import { ButtonProps, IconAngleDown, IconAngleUp } from 'hds-react';
import React, { useRef, useState } from 'react';
import mergeRefs from 'react-merge-refs';
import useMeasure from 'react-use-measure';

import { useTheme } from '../../../domain/app/theme/Theme';
import useDropdownKeyboardNavigation from '../../../hooks/useDropdownKeyboardNavigation';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import useIsComponentFocused from '../../../hooks/useIsComponentFocused';
import Button from '../button/Button';
// eslint-disable-next-line import/no-named-as-default
import Menu, { MenuPosition } from './menu/Menu';
import styles from './menuDropdown.module.scss';
import { MenuItemOptionProps } from './types';

export type MenuDropdownProps = React.PropsWithChildren<{
  button?: React.ReactElement;
  buttonAriaLabel?: string;
  buttonLabel: string;
  className?: string;
  closeOnItemClick?: boolean;
  fixedPosition?: boolean;
  id?: string;
  items: MenuItemOptionProps[];
  menuPosition?: MenuPosition;
}>;

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  button,
  buttonAriaLabel,
  buttonLabel,
  className,
  closeOnItemClick,
  fixedPosition = false,
  id: _id,
  items,
  menuPosition,
}) => {
  const { theme } = useTheme();
  const disabledIndices = items.reduce(
    (acc: number[], item, i) => (item.disabled ? [...acc, i] : acc),
    []
  );
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [ref, menuContainerSize] = useMeasure({
    // Detect scroll events only if menu is open to improve performance
    scroll: fixedPosition && menuOpen,
    polyfill: ResizeObserver,
  });

  const toggleButton = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isComponentFocused = useIsComponentFocused(containerRef);

  const id = useIdWithPrefix({ id: _id, prefix: 'menu-dropdown-' });
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;

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
          setFocusToButton();
          break;
        case 'Enter':
          const item = items[focusedIndex];
          /* istanbul ignore else */
          if (menuOpen && item) {
            item.onClick();
            handleItemClick();
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

  const setFocusToButton = () => {
    toggleButton.current?.focus();
  };

  const onDocumentClick = (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Node && containerRef.current?.contains(target))) {
      ensureMenuIsClosed();
    }
  };

  const handleItemClick = (event?: React.MouseEvent<HTMLElement>) => {
    if (closeOnItemClick) {
      ensureMenuIsClosed();
      setFocusToButton();
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
      React.cloneElement(button, { ...commonProps, ref: toggleButton })
    ) : (
      <Button
        {...commonProps}
        ref={toggleButton}
        fullWidth={true}
        iconRight={
          menuOpen ? <IconAngleUp aria-hidden /> : <IconAngleDown aria-hidden />
        }
        variant="secondary"
      >
        <span>{buttonLabel}</span>
      </Button>
    );
  };

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setMenuOpen(!menuOpen);
  };

  return (
    <div
      ref={mergeRefs<HTMLDivElement>([ref, containerRef])}
      className={classNames(
        styles.menuDropdown,
        css(theme.menuDropdown),
        className
      )}
    >
      {getToggleButton()}
      <Menu
        ariaLabelledBy={buttonId}
        fixedPosition={fixedPosition}
        focusedIndex={focusedIndex}
        id={menuId}
        items={items}
        onItemClick={handleItemClick}
        menuContainerSize={menuContainerSize}
        menuOpen={menuOpen}
        menuPosition={menuPosition}
        setFocusedIndex={setFocusedIndex}
      />
    </div>
  );
};

export default MenuDropdown;
