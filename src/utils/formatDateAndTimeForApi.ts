import setDateTime from './setDateTime';

const formatDateAndTimeForApi = (
  date: Date | string,
  timeStr: string
): string | null => {
  if (!date || !timeStr) {
    return null;
  }

  const dateWithTime = setDateTime(new Date(date), timeStr);

  return dateWithTime.toISOString();
};

export default formatDateAndTimeForApi;
