import { FC, PropsWithChildren } from 'react';

import styles from './adminListPageWrapper.module.scss';

const AdminListPageWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.adminListPageWrapper}>{children}</div>;
};

export default AdminListPageWrapper;
