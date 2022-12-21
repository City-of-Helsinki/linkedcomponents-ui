import { useField } from 'formik';
import { createContext, FC, PropsWithChildren } from 'react';

import { EventFieldsFragment } from '../../../../generated/graphql';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import { EventTime, RecurringEventSettings } from '../../types';

export const timeSectionContextDefaultValue: TimeSectionContextProps = {
  events: [],
  eventTimes: [],
  eventType: EVENT_TYPE.General,
  isEditingAllowed: true,
  isUmbrella: false,
  recurringEvents: [],
  setEvents: () => undefined,
  setEventTimes: () => undefined,
  setIsUmbrella: () => undefined,
  setRecurringEvents: () => undefined,
};

export type TimeSectionContextProps = {
  events: EventTime[];
  eventTimes: EventTime[];
  eventType: EVENT_TYPE;
  isEditingAllowed: boolean;
  isUmbrella: boolean;
  recurringEvents: RecurringEventSettings[];
  savedEvent?: EventFieldsFragment;
  setEvents: (events: EventTime[]) => void;
  setEventTimes: (events: EventTime[]) => void;
  setIsUmbrella: (isUmbrella: boolean) => void;
  setRecurringEvents: (recurringEvents: RecurringEventSettings[]) => void;
};

export type TimeSectionProviderProps = {
  isEditingAllowed: boolean;
  savedEvent?: EventFieldsFragment;
};

export const TimeSectionContext = createContext<
  TimeSectionContextProps | undefined
>(undefined);

export const TimeSectionProvider: FC<
  PropsWithChildren<TimeSectionProviderProps>
> = ({ children, isEditingAllowed, savedEvent }) => {
  const [{ value: eventType }] = useField(EVENT_FIELDS.TYPE);
  const [{ value: isUmbrella }, , { setValue: setIsUmbrella }] = useField(
    EVENT_FIELDS.IS_UMBRELLA
  );
  const [{ value: eventTimes }, , { setValue: setEventTimes }] = useField<
    EventTime[]
  >(EVENT_FIELDS.EVENT_TIMES);
  const [{ value: events }, , { setValue: setEvents }] = useField<EventTime[]>(
    EVENT_FIELDS.EVENTS
  );
  const [{ value: recurringEvents }, , { setValue: setRecurringEvents }] =
    useField<RecurringEventSettings[]>(EVENT_FIELDS.RECURRING_EVENTS);

  return (
    <TimeSectionContext.Provider
      value={{
        events,
        eventTimes,
        eventType,
        isEditingAllowed,
        isUmbrella,
        recurringEvents,
        savedEvent,
        setEvents,
        setEventTimes,
        setIsUmbrella,
        setRecurringEvents,
      }}
    >
      {children}
    </TimeSectionContext.Provider>
  );
};
