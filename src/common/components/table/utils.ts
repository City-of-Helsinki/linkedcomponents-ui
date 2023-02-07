import { Header, Order } from './types';

const shouldNotSortRows = (
  order: Order | undefined,
  sorting: string | undefined,
  sortingEnabled: boolean
): boolean => {
  return !sortingEnabled || !order || !sorting;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultSortCompareFunction: (a: any, b: any) => number = (a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }

  return 0;
};

export const processRows = (
  rows: Array<object>,
  order: Order | undefined,
  sorting: string | undefined,
  cols: Header[]
) => {
  const sortingEnabled = cols.some((column) => {
    return column.isSortable === true;
  });

  if (shouldNotSortRows(order, sorting, sortingEnabled)) {
    return [...rows];
  }

  const sortColumn = cols.find((column) => {
    return column.key === sorting;
  });

  const sortCompareFunction =
    sortColumn?.customSortCompareFunction || defaultSortCompareFunction;

  const sortedRows = [...rows].sort((a, b) => {
    const aValue = a[sorting as keyof typeof a];
    const bValue = b[sorting as keyof typeof b];

    return sortCompareFunction(aValue, bValue);
  });

  return order === 'asc' ? sortedRows : sortedRows.reverse();
};
