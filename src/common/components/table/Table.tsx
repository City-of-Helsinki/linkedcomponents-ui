import { ClassNames } from '@emotion/react';
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
      <ClassNames>
        {({ css, cx }) => (
          <table
            {...rest}
            ref={ref}
            className={cx(styles.table, css(theme.table), className)}
          >
            {children}
          </table>
        )}
      </ClassNames>
    );
  }
);

export default Table;
