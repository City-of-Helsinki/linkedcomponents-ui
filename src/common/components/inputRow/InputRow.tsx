import React from 'react';

import styles from './inputRow.module.scss';

interface Props {
  children: React.ReactNode;
  info?: React.ReactElement;
}

const InputRow: React.FC<Props> = ({ children, info }) => {
  return (
    <div className={styles.inputRow}>
      {info && <div className={styles.infoColumn}>{info}</div>}
      <div className={styles.inputColumn}>{children}</div>
    </div>
  );
};

export default InputRow;
