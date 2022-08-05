import parseDate from 'date-fns/parse';

import { DATE_FORMAT_2 } from '../constants';
import formatDate from './formatDate';

const parseDateForPayload = (dateStr: string) =>
  formatDate(parseDate(dateStr, DATE_FORMAT_2, new Date()), 'yyyy-MM-dd');

export default parseDateForPayload;
