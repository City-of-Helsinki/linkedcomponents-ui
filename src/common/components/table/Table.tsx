/* eslint-disable max-len */
// import core base styles
import 'hds-core';

import { TableProps as HdsTableProps } from 'hds-react';
import React, { useMemo, useState } from 'react';

import BodyRow from './bodyRow/BodyRow';
import HeaderRow from './headerRow/HeaderRow';
import NoResultsRow from './noResultsRow/NoResultsRow';
import { SortingHeaderCell } from './sortingHeaderCell/SortingHeaderCell';
import styles from './table.module.scss';
import TableBody from './tableBody/TableBody';
import { TableContainer } from './tableContainer/TableContainer';
import { Header, Order } from './types';
import { processRows } from './utils';

export type GetRowPropsFunc = (
  item: object
) => React.ComponentPropsWithoutRef<'tr'>;

type TableProps = {
  cols: Header[];
  getRowProps?: GetRowPropsFunc;
  noResultsText?: string;
  onRowClick?: (item: object) => void;
  showNoResultsRow?: boolean;
} & Omit<
  HdsTableProps,
  | 'ariaLabelCheckboxSelection'
  | 'checkboxSelection'
  | 'clearSelectionsText'
  | 'cols'
  | 'customActionButtons'
  | 'heading'
  | 'headingAriaLevel'
  | 'headingClassName'
  | 'headingId'
  | 'selectAllRowsText'
  | 'selectedRows'
  | 'setSelectedRows'
  | 'theme'
  | 'verticalHeaders'
>;

const Table = ({
  ariaLabelSortButtonAscending,
  ariaLabelSortButtonDescending,
  ariaLabelSortButtonUnset = '',
  caption,
  cols,
  dataTestId = 'hds-table-data-testid',
  dense = false,
  getRowProps,
  id = 'hds-table-id',
  indexKey,
  initialSortingColumnKey,
  initialSortingOrder,
  noResultsText,
  onRowClick,
  onSort,
  renderIndexCol = true,
  rows,
  showNoResultsRow = true,
  textAlignContentRight = false,
  variant = 'dark',
  verticalLines = false,
  zebra = false,
  ...rest
}: TableProps) => {
  const [sorting, setSorting] = useState<string | undefined>(
    initialSortingColumnKey
  );
  const [order, setOrder] = useState<Order | undefined>(initialSortingOrder);

  const setSortingAndOrder = (colKey: string): void => {
    if (sorting === colKey) {
      setOrder(order === 'desc' ? 'asc' : 'desc');
    } else {
      setOrder('asc');
    }
    setSorting(colKey);
  };

  const processedRows = useMemo(
    () => processRows(rows, order, sorting, cols),
    [rows, sorting, order, cols]
  );

  const visibleColumns = renderIndexCol
    ? cols
    : cols.filter((column) => column.key !== indexKey);

  return (
    <>
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
        <thead>
          <HeaderRow>
            {visibleColumns.map((column) => {
              if (column.isSortable) {
                return (
                  <SortingHeaderCell
                    key={column.key}
                    className={column.className}
                    colKey={column.key}
                    title={column.headerName}
                    ariaLabelSortButtonUnset={ariaLabelSortButtonUnset}
                    ariaLabelSortButtonAscending={ariaLabelSortButtonAscending}
                    ariaLabelSortButtonDescending={
                      ariaLabelSortButtonDescending
                    }
                    setSortingAndOrder={setSortingAndOrder}
                    onSort={onSort}
                    order={sorting === column.key ? (order as Order) : 'unset'}
                    sortIconType={column.sortIconType ?? 'string'}
                  />
                );
              }
              return (
                <th className={column.className} key={column.key} scope="col">
                  {column.headerName}
                </th>
              );
            })}
          </HeaderRow>
        </thead>
        <TableBody textAlignContentRight={textAlignContentRight}>
          {processedRows.map((row, index) => (
            <BodyRow
              cols={visibleColumns}
              getRowProps={getRowProps}
              index={index}
              key={row[indexKey as keyof typeof row]}
              onRowClick={onRowClick}
              row={row}
            />
          ))}
          {showNoResultsRow && !processedRows.length && (
            <NoResultsRow
              colSpan={visibleColumns.length}
              noResultsText={noResultsText}
            />
          )}
        </TableBody>
      </TableContainer>
    </>
  );
};

export default Table;
