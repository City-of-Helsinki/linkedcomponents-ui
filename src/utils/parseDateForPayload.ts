import { DATE_FORMAT_API } from '../constants';
import formatDate from './formatDate';
import parseDateText from './parseDateText';

const parseDateForPayload = (dateStr: string, timeStr?: string) => {
  const date = parseDateText(dateStr, timeStr);

  if (!date) {
    return '';
  }

  return timeStr ? date.toISOString() : formatDate(date, DATE_FORMAT_API);
};

export default parseDateForPayload;
