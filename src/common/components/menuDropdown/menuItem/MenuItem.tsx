import classNames from 'classnames';
import React from 'react';

import { MenuItemOptionProps } from '../types';
import styles from './menuItem.module.scss';

export type MenuItemProps = MenuItemOptionProps & {
  index: number;
  isFocused: boolean;
  setFocusedIndex: (index: number) => void;
};

const MenuItem: React.FC<MenuItemProps> = ({
  disabled,
  icon,
  index,
  isFocused,
  label,
  onClick,
  setFocusedIndex,
  title,
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const onFocusOrMouseOver = (
    event:
      | React.FocusEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    /* istanbul ignore else */
    if (!disabled) {
      setFocusedIndex(index);
    }
  };

  React.useEffect(() => {
    if (isFocused) {
      buttonRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <button
      ref={buttonRef}
      className={classNames(styles.item, { [styles.highlighted]: isFocused })}
      disabled={disabled}
      onClick={onClick}
      onMouseOver={onFocusOrMouseOver}
      onFocus={onFocusOrMouseOver}
      title={title}
      type="button"
    >
      <span aria-hidden={true}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default MenuItem;
