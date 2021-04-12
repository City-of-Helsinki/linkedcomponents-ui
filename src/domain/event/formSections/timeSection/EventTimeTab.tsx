import React from 'react';
import { useTranslation } from 'react-i18next';

import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import { EventTime, RecurringEventSettings } from '../../types';
import AddEventTimeForm from './AddEventTimeForm';
import EventTimesSummary from './EventTimesSummary';
import TimeSectionNotification from './TimeSectionNotification';
import { sortEventTimes } from './utils';

export interface EventTimeTabProps {
  eventTimes: EventTime[];
  eventType: string;
  recurringEvents: RecurringEventSettings[];
  setEventTimes: (eventTimes: EventTime[]) => void;
  setRecurringEvents: (recurringEvents: RecurringEventSettings[]) => void;
}

const EventTimeTab: React.FC<EventTimeTabProps> = ({
  eventTimes,
  eventType,
  recurringEvents,
  setEventTimes,
  setRecurringEvents,
}) => {
  const { t } = useTranslation();

  const addEventTime = (eventTime: EventTime) => {
    const sortedEventTimes = [...eventTimes];
    sortedEventTimes.push(eventTime);
    sortedEventTimes.sort(sortEventTimes);
    setEventTimes(sortedEventTimes);
  };

  return (
    <>
      <h3>{t(`event.form.titleEnterEventTime.${eventType}`)}</h3>
      <FieldRow
        notification={<TimeSectionNotification eventType={eventType} />}
      >
        <FieldColumn>
          <AddEventTimeForm addEventTime={addEventTime} eventType={eventType} />
        </FieldColumn>
        <EventTimesSummary
          eventTimes={eventTimes}
          eventType={eventType}
          recurringEvents={recurringEvents}
          setEventTimes={setEventTimes}
          setRecurringEvents={setRecurringEvents}
        />
      </FieldRow>
    </>
  );
};

export default EventTimeTab;
