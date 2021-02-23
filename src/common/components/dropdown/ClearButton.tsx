import React from 'react';

import styles from './dropdown.module.scss';

interface ClearButtonProps {
  children: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ClearButton = React.forwardRef<HTMLButtonElement, ClearButtonProps>(
  ({ children, onClick }, ref) => {
    return (
      <button
        ref={ref}
        className={styles.clearButton}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );
  }
);

export default ClearButton;
