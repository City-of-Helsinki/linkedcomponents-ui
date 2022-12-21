import { Header, Order } from './types';

export const processRows = (
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
