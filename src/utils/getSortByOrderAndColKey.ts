const getSortByOrderAndColKey = ({
  order,
  colKey,
}: {
  order: 'asc' | 'desc';
  colKey: string;
}) => (order === 'asc' ? colKey : `-${colKey}`);

export default getSortByOrderAndColKey;
