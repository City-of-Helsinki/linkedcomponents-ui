const getSortOrderAndKey = (
  sort: string
): {
  colKey: string;
  order: 'desc' | 'asc';
} => {
  return {
    colKey: sort.replaceAll('-', ''),
    order: sort.startsWith('-') ? 'desc' : 'asc',
  };
};

export default getSortOrderAndKey;
