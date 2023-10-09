import React, { PropsWithChildren } from 'react';

import styles from './splittedRow.module.scss';

const SplittedRow: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.splittedRow}>{children}</div>;
};

export default SplittedRow;
