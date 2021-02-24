import classNames from 'classnames';
import { IconAngleDown } from 'hds-react';
import React from 'react';

import styles from './dropdown.module.scss';

export interface ToggleButtonProps {
  icon?: React.ReactElement;
  id: string;
  isOpen: boolean;
  menuId: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  selectedText?: string;
  toggleButtonLabel: string;
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    { icon, id, isOpen, menuId, onClick, selectedText, toggleButtonLabel },
    ref
  ) => {
    return (
      <button
        ref={ref}
        id={id}
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={toggleButtonLabel}
        className={classNames(styles.toggleButton, { [styles.open]: isOpen })}
        onClick={onClick}
        type="button"
      >
        {icon && (
          <span className={styles.icon} aria-hidden>
            {icon}
          </span>
        )}
        <div className={styles.title}>{selectedText || toggleButtonLabel}</div>
        <IconAngleDown className={styles.angleIcon} aria-hidden />
      </button>
    );
  }
);

export default ToggleButton;
