import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

import getTimeObject from './getTimeObject';

const setDateTime = (date: Date, timeStr: string): Date => {
  const { hours, minutes } = getTimeObject(timeStr);

  date = setHours(date, hours);
  date = setMinutes(date, minutes);

  return date;
};

export default setDateTime;
