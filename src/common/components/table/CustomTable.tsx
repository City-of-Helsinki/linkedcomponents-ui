/* eslint-disable max-len */
// import core base styles
import 'hds-core';

import { TableProps as HdsTableProps } from 'hds-react';
import React, { FC, PropsWithChildren } from 'react';

import styles from './table.module.scss';
import { TableContainer } from './tableContainer/TableContainer';

type TableProps = React.ComponentPropsWithoutRef<'table'> & {
  className?: string;
} & Pick<
    HdsTableProps,
    'caption' | 'dataTestId' | 'dense' | 'variant' | 'verticalLines' | 'zebra'
  >;

const CustomTable: FC<PropsWithChildren<TableProps>> = ({
  caption,
  children,
  dataTestId = 'hds-table-data-testid',
  dense = false,
  id = 'hds-table-id',
  variant,
  verticalLines = false,
  zebra = false,
  ...rest
}) => {
  return (
    <TableContainer
      variant={variant}
      dataTestId={dataTestId}
      dense={dense}
      id={id}
      zebra={zebra}
      verticalLines={verticalLines}
      {...rest}
    >
      {caption && <caption className={styles.caption}>{caption}</caption>}
      {children}
    </TableContainer>
  );
};

export default CustomTable;
