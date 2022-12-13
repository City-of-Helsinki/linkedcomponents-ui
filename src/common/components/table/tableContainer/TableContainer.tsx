import classNames from 'classnames';
import React from 'react';

import styles from '../table.module.scss';

export type TableContainerProps = React.ComponentPropsWithoutRef<'table'> & {
  children: React.ReactNode;
  customThemeClass?: string;
  dataTestId?: string;
  dense?: boolean;
  id: string;
  variant?: 'dark' | 'light';
  verticalLines?: boolean;
  zebra?: boolean;
};

export const TableContainer = ({
  children,
  className,
  customThemeClass,
  dataTestId,
  dense,
  id,
  verticalLines,
  variant = 'dark',
  zebra,
  ...rest
}: TableContainerProps) => {
  return (
    <div tabIndex={0} className={styles.container}>
      <table
        className={classNames(
          styles.table,
          styles[variant],
          { [styles.dense]: dense, [styles.zebra]: zebra },
          className,
          customThemeClass
        )}
        data-testid={dataTestId}
        id={id}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
};
