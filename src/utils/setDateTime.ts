import setHours from 'date-fns/setHours';
import setMilliseconds from 'date-fns/setMilliseconds';
import setMinutes from 'date-fns/setMinutes';
import setSeconds from 'date-fns/setSeconds';

import getTimeObject from './getTimeObject';

const setDateTime = (date: Date, timeStr: string): Date => {
  const { hours, minutes } = getTimeObject(timeStr);

  date = setHours(date, hours);
  date = setMinutes(date, minutes);
  date = setSeconds(date, 0);
  date = setMilliseconds(date, 0);

  return date;
};

export default setDateTime;
