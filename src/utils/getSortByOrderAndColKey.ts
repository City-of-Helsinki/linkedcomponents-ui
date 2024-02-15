import { Order } from '../common/components/table/types';

const getSortByOrderAndColKey = ({
  order,
  colKey,
}: {
  order: Order;
  colKey: string;
}) => (order === 'asc' ? colKey : `-${colKey}`);

export default getSortByOrderAndColKey;
