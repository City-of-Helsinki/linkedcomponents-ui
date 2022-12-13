import classNames from 'classnames';
import React from 'react';

import styles from '../table.module.scss';

export type TableBodyProps = {
  children: React.ReactNode;
  textAlignContentRight?: boolean;
};

const TableBody = ({ children, textAlignContentRight }: TableBodyProps) => {
  return (
    <tbody
      className={classNames(styles.content, {
        [styles.textAlignContentRight]: textAlignContentRight,
      })}
    >
      {children}
    </tbody>
  );
};

export default TableBody;
