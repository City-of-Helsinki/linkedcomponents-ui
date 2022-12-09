import React from 'react';

import styles from '../table2.module.scss';

export const HeaderRow: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <tr className={styles.headerRow}>{children}</tr>;
};
