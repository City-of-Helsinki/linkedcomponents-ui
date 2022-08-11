import isValid from 'date-fns/isValid';

import setDateTime from './setDateTime';

const formatDateAndTimeForApi = (
  date: Date | string,
  timeStr: string
): string | null => {
  if (!date || !isValid(new Date(date))) {
    return null;
  }

  const dateWithTime = setDateTime(new Date(date), timeStr);

  return dateWithTime.toISOString();
};

export default formatDateAndTimeForApi;
