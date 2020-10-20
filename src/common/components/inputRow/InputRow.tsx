import React from 'react';

import styles from './inputRow.module.scss';

interface Props {
  children: React.ReactNode;
  info?: React.ReactElement;
}

const InputRow: React.FC<Props> = ({ children, info }) => {
  return (
    <div className={styles.inputRow}>
      <div className={styles.inputColumn}>{children}</div>
      <div className={styles.infoColumn}>{info}</div>
    </div>
  );
};

export default InputRow;
