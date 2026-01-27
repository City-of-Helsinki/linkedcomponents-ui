import addDays from 'date-fns/addDays';
import isBefore from 'date-fns/isBefore';
import startOfDay from 'date-fns/startOfDay';

import { WEB_STORE_REFUND_DEADLINE_DAYS } from '../../envVariables';

export const isWithinRefundDeadline = (
  eventStartTime: string | null | undefined
): boolean => {
  if (!eventStartTime) {
    return false;
  }

  try {
    const eventStartDate = new Date(eventStartTime);
    const deadlineDate = addDays(
      eventStartDate,
      -WEB_STORE_REFUND_DEADLINE_DAYS
    );
    const nextDayAfterDeadline = startOfDay(addDays(deadlineDate, 1));

    return isBefore(new Date(), nextDayAfterDeadline);
  } catch {
    return false;
  }
};
