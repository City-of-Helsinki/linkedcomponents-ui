import getSortByOrderAndColKey from './getSortByOrderAndColKey';
import getSortOrderAndKey from './getSortOrderAndKey';

const getSortByColKey = ({
  colKey,
  sort,
}: {
  colKey: string;
  sort: string;
}) => {
  const { colKey: currentColKey, order } = getSortOrderAndKey(sort);

  if (currentColKey === colKey) {
    return getSortByOrderAndColKey({
      order: order === 'desc' ? 'asc' : 'desc',
      colKey,
    });
  } else {
    return getSortByOrderAndColKey({ order: 'asc', colKey });
  }
};

export default getSortByColKey;
