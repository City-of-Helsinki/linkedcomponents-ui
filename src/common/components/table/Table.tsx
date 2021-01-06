import classNames from 'classnames';
import { css } from 'emotion';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './table.module.scss';

type TableProps = React.ComponentPropsWithoutRef<'table'> & {
  className?: string;
};

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <table
        {...rest}
        ref={ref}
        className={classNames(styles.table, css(theme.table), className)}
      >
        {children}
      </table>
    );
  }
);

export default Table;
