// import core base styles
import 'hds-core';

import { TableProps as HdsTableProps } from 'hds-react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import noResultsImage from '../../../assets/images/jpg/no-results.jpg';
import BodyRow from './bodyRow/BodyRow';
import { HeaderRow } from './headerRow/HeaderRow';
import { SortingHeaderCell } from './sortingHeaderCell/SortingHeaderCell';
import styles from './table2.module.scss';
import TableBody from './tableBody/TableBody';
import { TableContainer } from './tableContainer/TableContainer';

type Order = 'asc' | 'desc';

export type GetRowPropsFunc = (
  item: object
) => React.ComponentPropsWithoutRef<'tr'>;

export type Header = {
  className?: string;
  /**
   * Custom sort compare function
   */
  customSortCompareFunction?: (a: object, b: object) => number;
  /**
   * Boolean indicating whether a column is sortable
   */
  isSortable?: boolean;
  /**
   * Key of header. Maps with the corresponding row data keys.
   */
  key: string;
  /**
   * Visible header name that is rendered.
   */
  headerName: string;
  /**
   * Sort icon type to be used in sorting. Use type string if the content is a string, otherwise use type other.
   * @default 'string'
   */
  onClick?: (event: React.MouseEvent) => void;
  sortIconType?: 'string' | 'other';
  /**
   * Transform function for the corresponding row data. Use this to render custom content inside the table cell.
   */
  transform?: ({ args }: any) => string | React.ReactElement; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const processRows = (
  rows: Array<object>,
  order: Order | undefined,
  sorting: string | undefined,
  cols: Header[]
) => {
  const sortingEnabled = cols.some((column) => {
    return column.isSortable === true;
  });

  if (!sortingEnabled || !order || !sorting) {
    return [...rows];
  }

  const sortColumn = cols.find((column) => {
    return column.key === sorting;
  });

  const customSortCompareFunction = sortColumn?.customSortCompareFunction;

  if (customSortCompareFunction) {
    const sortedRows = [...rows].sort((a, b) => {
      const aValue = a[sorting as keyof typeof a];
      const bValue = b[sorting as keyof typeof b];

      return customSortCompareFunction(aValue, bValue);
    });

    if (order === 'asc') {
      return sortedRows;
    }
    if (order === 'desc') {
      return sortedRows.reverse();
    }
  }

  return [...rows].sort((a, b) => {
    const aValue = a[sorting as keyof typeof a];
    const bValue = b[sorting as keyof typeof b];

    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1;
    }

    return 0;
  });
};

type TableProps = {
  cols: Header[];
  getRowProps?: GetRowPropsFunc;
  noResultsText?: string;
  onRowClick?: (item: object) => void;
} & Omit<
  HdsTableProps,
  | 'ariaLabelCheckboxSelection'
  | 'checkboxSelection'
  | 'clearSelectionsText'
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
  textAlignContentRight = false,
  variant = 'dark',
  verticalLines = false,
  zebra = false,
  ...rest
}: TableProps) => {
  const { t } = useTranslation();
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
                    ariaLabelSortButtonAscending={
                      ariaLabelSortButtonAscending ||
                      t('common.table.ariaLabelSortButtonAscending')
                    }
                    ariaLabelSortButtonDescending={
                      ariaLabelSortButtonDescending ||
                      t('common.table.ariaLabelSortButtonDescending')
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
          {!processedRows.length && (
            <tr className={styles.noResultsRow}>
              <td colSpan={visibleColumns.length}>
                <div className={styles.wrapper}>
                  <div>{noResultsText || t('common.table.noResultsText')}</div>
                  <img src={noResultsImage} alt="" />
                </div>
              </td>
            </tr>
          )}
        </TableBody>
      </TableContainer>
    </>
  );
};

export default Table;
