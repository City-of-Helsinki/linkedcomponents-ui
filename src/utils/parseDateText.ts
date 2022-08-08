import parseDate from 'date-fns/parse';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

import { DATE_FORMAT_2 } from '../constants';

const parseDateText = (dateStr: string, timeStr?: string) => {
  let date = parseDate(dateStr, DATE_FORMAT_2, new Date());

  if (timeStr) {
    const [hours, minutes] = timeStr.replace('.', ':').split(':');

    date = setHours(date, Number(hours));
    date = setMinutes(date, Number(minutes));
  }

  return date;
};

export default parseDateText;
