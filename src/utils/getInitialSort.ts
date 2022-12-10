const getInitialSort = (
  sort: string
): {
  initialSortingColumnKey: string | undefined;
  initialSortingOrder: 'desc' | 'asc' | undefined;
} => {
  return {
    initialSortingColumnKey: sort.replace('-', ''),
    initialSortingOrder: sort.startsWith('-') ? 'desc' : 'asc',
  };
};

export default getInitialSort;
