import isBefore from 'date-fns/isBefore';
import isEqual from 'date-fns/isEqual';

import {
  EventFieldsFragment,
  PublicationStatus,
} from '../../../../generated/graphql';
import { EVENT_ACTIONS } from '../../constants';
import { EventTime, RecurringEventSettings } from '../../types';

export type GetEventEditActionParams = {
  action: 'delete' | 'update';
  event: EventFieldsFragment;
};

export const getEventEditAction = ({
  action,
  event,
}: GetEventEditActionParams): EVENT_ACTIONS => {
  switch (action) {
    case 'delete':
      return EVENT_ACTIONS.DELETE;
    case 'update':
      return event.publicationStatus === PublicationStatus.Draft
        ? EVENT_ACTIONS.UPDATE_DRAFT
        : EVENT_ACTIONS.UPDATE_PUBLIC;
  }
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
    { id: null, startTime: a.startDate as Date, endTime: a.endDate as Date },
    { id: null, startTime: b.startDate as Date, endTime: b.endDate as Date }
  );
};
