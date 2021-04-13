import React from 'react';
import { useTranslation } from 'react-i18next';

import { EventFieldsFragment } from '../../../../generated/graphql';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import { EventTime, RecurringEventSettings } from '../../types';
import AddEventTimeForm from './AddEventTimeForm';
import EventTimesSummary from './EventTimesSummary';
import TimeSectionNotification from './TimeSectionNotification';
import { sortEventTimes } from './utils';
import ValidationError from './ValidationError';

export interface EventTimeTabProps {
  events: EventTime[];
  eventTimes: EventTime[];
  eventType: string;
  recurringEvents: RecurringEventSettings[];
  savedEvent?: EventFieldsFragment;
  setEvents: (eventTimes: EventTime[]) => void;
  setEventTimes: (eventTimes: EventTime[]) => void;
  setRecurringEvents: (recurringEvents: RecurringEventSettings[]) => void;
}

const EventTimeTab: React.FC<EventTimeTabProps> = ({
  events,
  eventTimes,
  eventType,
  recurringEvents,
  savedEvent,
  setEvents,
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
          <AddEventTimeForm
            addEventTime={addEventTime}
            eventType={eventType}
            savedEvent={savedEvent}
          />
          <ValidationError />
        </FieldColumn>
        <EventTimesSummary
          events={events}
          eventTimes={eventTimes}
          eventType={eventType}
          recurringEvents={recurringEvents}
          savedEvent={savedEvent}
          setEvents={setEvents}
          setEventTimes={setEventTimes}
          setRecurringEvents={setRecurringEvents}
        />
      </FieldRow>
    </>
  );
};

export default EventTimeTab;
