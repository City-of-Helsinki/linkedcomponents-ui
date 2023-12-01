import classNames from 'classnames';
import React from 'react';

import styles from '../table.module.scss';

interface Props {
  className?: string;
  inlineWithBackground?: boolean;
}

const TableWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  inlineWithBackground,
}) => {
  return (
    <div
      className={classNames(styles.tableWrapper, className, {
        [styles.inlineWithBackground]: inlineWithBackground,
      })}
    >
      {children}
    </div>
  );
};

export default TableWrapper;
