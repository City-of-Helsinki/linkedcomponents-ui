import React from 'react';

import FieldColumn from '../../layout/FieldColumn';
import { EventTime, RecurringEventSettings } from '../../types';
import EventTimesTable from './EventTimesTable';
import RecurringEvents from './RecurringEvents';
import styles from './timeSection.module.scss';

export interface EventTimesSummaryProps {
  eventTimes: EventTime[];
  eventType: string;
  recurringEvents: RecurringEventSettings[];
  setEventTimes: (eventTimes: EventTime[]) => void;
  setRecurringEvents: (recurringEvents: RecurringEventSettings[]) => void;
}

const EventTimesSummary: React.FC<EventTimesSummaryProps> = ({
  eventTimes,
  eventType,
  recurringEvents,
  setEventTimes,
  setRecurringEvents,
}) => {
  const isVisible = eventTimes.length || recurringEvents.length;

  if (!isVisible) {
    return null;
  }

  const getStartIndex = () => {
    let startIndex = 1;
    recurringEvents.forEach((recurringEvent) => {
      startIndex = startIndex + recurringEvent.eventTimes.length;
    });
    return startIndex;
  };

  return (
    <div>
      <div className={styles.divider} />
      <RecurringEvents
        eventType={eventType}
        recurringEvents={recurringEvents}
        setRecurringEvents={setRecurringEvents}
      />
      <FieldColumn>
        <EventTimesTable
          eventTimes={eventTimes}
          eventType={eventType}
          setEventTimes={setEventTimes}
          startIndex={getStartIndex()}
        />
      </FieldColumn>
    </div>
  );
};

export default EventTimesSummary;
