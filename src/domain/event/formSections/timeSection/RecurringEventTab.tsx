import React from 'react';
import { useTranslation } from 'react-i18next';

import { EventFieldsFragment } from '../../../../generated/graphql';
import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import { EventTime, RecurringEventSettings } from '../../types';
import AddRecurringEventForm from './AddRecurringEventForm';
import EventTimesSummary from './EventTimesSummary';
import TimeSectionNotification from './TimeSectionNotification';
import { sortRecurringEvents } from './utils';
import ValidationError from './ValidationError';

export interface RecurringEventTabProps {
  events: EventTime[];
  eventTimes: EventTime[];
  eventType: string;
  recurringEvents: RecurringEventSettings[];
  savedEvent?: EventFieldsFragment;
  setEvents: (eventTimes: EventTime[]) => void;
  setEventTimes: (eventTimes: EventTime[]) => void;
  setRecurringEvents: (recurringEvents: RecurringEventSettings[]) => void;
}

const RecurringEventTab: React.FC<RecurringEventTabProps> = ({
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

  const addRecurringEvent = (recurringEvent: RecurringEventSettings) => {
    const sortedRecurringEvents = [...recurringEvents];
    sortedRecurringEvents.push(recurringEvent);
    sortedRecurringEvents.sort(sortRecurringEvents);
    setRecurringEvents(sortedRecurringEvents);
  };

  return (
    <>
      <h3>{t('event.form.titleRecurringEvent')}</h3>
      <FieldRow
        notification={<TimeSectionNotification eventType={eventType} />}
      >
        <FieldColumn>
          <AddRecurringEventForm
            eventType={eventType}
            onSubmit={addRecurringEvent}
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

export default RecurringEventTab;
