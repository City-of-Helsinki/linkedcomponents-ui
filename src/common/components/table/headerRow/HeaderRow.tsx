import React from 'react';

import styles from '../table.module.scss';

const HeaderRow: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <tr className={styles.headerRow}>{children}</tr>;
};

export default HeaderRow;
