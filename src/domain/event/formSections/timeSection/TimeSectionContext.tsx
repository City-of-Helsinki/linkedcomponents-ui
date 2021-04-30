import { createContext } from 'react';

import { EventFieldsFragment } from '../../../../generated/graphql';
import { EVENT_TYPE } from '../../constants';
import { EventTime, RecurringEventSettings } from '../../types';

export const timeSectionContextDefaultValue: TimeSectionContextProps = {
  events: [],
  eventTimes: [],
  eventType: EVENT_TYPE.EVENT,
  recurringEvents: [],
  setEvents: () => undefined,
  setEventTimes: () => undefined,
  setRecurringEvents: () => undefined,
};

export type TimeSectionContextProps = {
  events: EventTime[];
  eventTimes: EventTime[];
  eventType: EVENT_TYPE;
  recurringEvents: RecurringEventSettings[];
  savedEvent?: EventFieldsFragment;
  setEvents: (events: EventTime[]) => void;
  setEventTimes: (events: EventTime[]) => void;
  setRecurringEvents: (recurringEvents: RecurringEventSettings[]) => void;
};

export default createContext(timeSectionContextDefaultValue);
