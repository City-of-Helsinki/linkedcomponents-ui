import classNames from 'classnames';
import React from 'react';

import styles from './table.module.scss';

interface Props {
  className?: string;
}

const TableWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  return (
    <div className={classNames(styles.tableWrapper, className)}>{children}</div>
  );
};

export default TableWrapper;
