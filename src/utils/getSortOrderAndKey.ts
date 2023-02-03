const getSortOrderAndKey = (
  sort: string
): {
  colKey: string;
  order: 'desc' | 'asc';
} => {
  return {
    colKey: sort.replace(/-/g, ''),
    order: sort.startsWith('-') ? 'desc' : 'asc',
  };
};

export default getSortOrderAndKey;
