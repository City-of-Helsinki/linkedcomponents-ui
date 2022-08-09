import isBefore from 'date-fns/isBefore';
import isEqual from 'date-fns/isEqual';
import max from 'date-fns/max';

import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../../generated/graphql';
import parseDateText from '../../../../utils/parseDateText';
import { EVENT_EDIT_ACTIONS } from '../../constants';
import { EventTime, RecurringEventSettings } from '../../types';

export type GetEventEditActionParams = {
  action: 'delete' | 'update';
  event: EventFieldsFragment;
};

export const getEventEditAction = ({
  action,
  event,
}: GetEventEditActionParams): EVENT_EDIT_ACTIONS => {
  switch (action) {
    case 'delete':
      return EVENT_EDIT_ACTIONS.DELETE;
    case 'update':
      return event.publicationStatus === PublicationStatus.Draft
        ? EVENT_EDIT_ACTIONS.UPDATE_DRAFT
        : EVENT_EDIT_ACTIONS.UPDATE_PUBLIC;
  }
};

export const getMinBookingDate = (date: string | Date | null): Date => {
  const formattedDate = typeof date === 'string' ? new Date(date) : date;
  return formattedDate ? max([formattedDate, new Date()]) : new Date();
};

export const sortEventTimes = (a: EventTime, b: EventTime): number => {
  const startTimeA = a.startTime
    ? new Date(a.startTime)
    : new Date('9999-12-31');
  const startTimeB = b.startTime
    ? new Date(b.startTime)
    : new Date('9999-12-31');
  const endTimeA = a.endTime ? new Date(a.endTime) : new Date('9999-12-31');
  const endTimeB = b.endTime ? new Date(b.endTime) : new Date('9999-12-31');

  if (!isEqual(startTimeA, startTimeB)) {
    return isBefore(startTimeA, startTimeB) ? -1 : 1;
  }
  return isBefore(new Date(endTimeA), new Date(endTimeB)) ? -1 : 1;
};

export const sortRecurringEvents = (
  a: RecurringEventSettings,
  b: RecurringEventSettings
): number => {
  return sortEventTimes(
    {
      id: null,
      startTime: parseDateText(a.startDate),
      endTime: parseDateText(a.endDate),
    },
    {
      id: null,
      startTime: parseDateText(b.startDate),
      endTime: parseDateText(b.endDate),
    }
  );
};
