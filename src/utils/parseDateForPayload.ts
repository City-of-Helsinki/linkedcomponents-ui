import formatDate from './formatDate';
import parseDateText from './parseDateText';

const parseDateForPayload = (dateStr: string, timeStr?: string) => {
  const date = parseDateText(dateStr, timeStr);

  if (!date) {
    return '';
  }

  return timeStr ? date.toISOString() : formatDate(date, 'yyyy-MM-dd');
};

export default parseDateForPayload;
