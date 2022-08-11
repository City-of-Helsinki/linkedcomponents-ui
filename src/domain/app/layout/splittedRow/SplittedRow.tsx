import React from 'react';

import styles from './splittedRow.module.scss';

type Props = {
  children: React.ReactNode;
};

const SplittedRow: React.FC<Props> = ({ children }) => {
  return <div className={styles.splittedRow}>{children}</div>;
};

export default SplittedRow;
