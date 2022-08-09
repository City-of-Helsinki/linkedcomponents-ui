import parseDate from 'date-fns/parse';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

import { DATE_FORMAT } from '../constants';
import getTimeObject from './getTimeObject';
import { isValidDate } from './validationUtils';

const parseDateText = (dateStr: string, timeStr?: string): Date | null => {
  if (!dateStr || !isValidDate(dateStr)) return null;

  let date = parseDate(dateStr, DATE_FORMAT, new Date());

  if (timeStr) {
    const { hours, minutes } = getTimeObject(timeStr);

    date = setHours(date, hours);
    date = setMinutes(date, minutes);
  }

  return date;
};

export default parseDateText;
