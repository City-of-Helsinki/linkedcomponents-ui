import React from 'react';

import styles from './fieldRow.module.scss';

interface Props {
  children: React.ReactNode;
  notification?: React.ReactElement;
}

const FieldRow: React.FC<Props> = ({ children, notification }) => {
  return (
    <div className={styles.fieldRow}>
      {notification && (
        <div className={styles.notificationColumn}>{notification}</div>
      )}
      <div className={styles.fieldColumn}>{children}</div>
    </div>
  );
};

export default FieldRow;
