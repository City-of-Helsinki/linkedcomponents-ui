import React from 'react';

import { EventFieldsFragment } from '../../../../generated/graphql';
import FieldColumn from '../../layout/FieldColumn';
import { EventTime, RecurringEventSettings } from '../../types';
import EventTimesTable from './EventTimesTable';
import RecurringEvents from './RecurringEvents';
import SavedEvents from './SavedEvents';
import styles from './timeSection.module.scss';

export interface EventTimesSummaryProps {
  events: EventTime[];
  eventTimes: EventTime[];
  eventType: string;
  recurringEvents: RecurringEventSettings[];
  savedEvent?: EventFieldsFragment;
  setEvents: (eventTimes: EventTime[]) => void;
  setEventTimes: (eventTimes: EventTime[]) => void;
  setRecurringEvents: (recurringEvents: RecurringEventSettings[]) => void;
}

const EventTimesSummary: React.FC<EventTimesSummaryProps> = ({
  events,
  eventTimes,
  eventType,
  recurringEvents,
  savedEvent,
  setEvents,
  setEventTimes,
  setRecurringEvents,
}) => {
  const isVisible =
    events.length || eventTimes.length || recurringEvents.length;

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
      <FieldColumn>
        <div className={styles.divider} />
        <SavedEvents
          events={events}
          eventType={eventType}
          savedEvent={savedEvent}
          setEvents={setEvents}
        />
      </FieldColumn>

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
