import isBefore from 'date-fns/isBefore';
import isValid from 'date-fns/isValid';

const getDatePickerInitialMonth = (minDate?: Date | string | null) => {
  if (!minDate || !isValid(new Date(minDate))) return new Date();

  return isBefore(new Date(minDate), new Date())
    ? new Date()
    : new Date(minDate);
};

export default getDatePickerInitialMonth;
