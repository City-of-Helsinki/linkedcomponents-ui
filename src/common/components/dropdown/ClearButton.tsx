import React from 'react';

import styles from './dropdown.module.scss';

interface ClearButtonProps {
  children: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ClearButton = ({ children, onClick }: ClearButtonProps) => {
  return (
    <button className={styles.clearButton} onClick={onClick} type="button">
      {children}
    </button>
  );
};
export default ClearButton;
