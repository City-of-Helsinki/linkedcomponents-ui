/* eslint-disable max-len */
// import core base styles
import 'hds-core';

import { TableProps as HdsTableProps } from 'hds-react';
import React, { FC, PropsWithChildren } from 'react';

import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import NoResults from './noResults/NoResults';
import styles from './table.module.scss';
import { TableContainer } from './tableContainer/TableContainer';
import TableWrapper, { TableWrapperProps } from './tableWrapper/TableWrapper';

type TableProps = React.ComponentPropsWithoutRef<'table'> & {
  className?: string;
  loading?: boolean;
  noResultsText?: string;
  showNoResults?: boolean;
} & TableWrapperProps &
  Pick<
    HdsTableProps,
    'caption' | 'dense' | 'variant' | 'verticalLines' | 'zebra'
  > & { dataTestId?: string };

const CustomTable: FC<PropsWithChildren<TableProps>> = ({
  caption,
  children,
  dataTestId = 'hds-table-data-testid',
  dense = false,
  hasActionButtons,
  id = 'hds-table-id',
  inlineWithBackground,
  loading,
  noResultsText,
  showNoResults,
  variant,
  verticalLines = false,
  zebra = false,
  wrapperClassName,
  ...rest
}) => {
  return (
    <TableWrapper
      hasActionButtons={hasActionButtons}
      inlineWithBackground={inlineWithBackground}
      wrapperClassName={wrapperClassName}
    >
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
      {loading && <LoadingSpinner isLoading={true} />}
      {!loading && showNoResults && <NoResults noResultsText={noResultsText} />}
    </TableWrapper>
  );
};

export default CustomTable;
