import classNames from 'classnames';
import React from 'react';

import styles from '../table.module.scss';

export type TableWrapperProps = {
  hasActionButtons?: boolean;
  inlineWithBackground?: boolean;
  wrapperClassName?: string;
};

const TableWrapper: React.FC<React.PropsWithChildren<TableWrapperProps>> = ({
  children,
  hasActionButtons,
  inlineWithBackground,
  wrapperClassName,
}) => {
  return (
    <div
      className={classNames(styles.tableWrapper, wrapperClassName, {
        [styles.inlineWithBackground]: inlineWithBackground,
        [styles.hasActionButtonColumn]: hasActionButtons,
      })}
    >
      {children}
    </div>
  );
};

export default TableWrapper;
