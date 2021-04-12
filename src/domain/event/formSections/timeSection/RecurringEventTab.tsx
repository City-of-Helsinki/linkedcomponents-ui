import React from 'react';
import { useTranslation } from 'react-i18next';

import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import { EventTime, RecurringEventSettings } from '../../types';
import AddRecurringEventForm from './AddRecurringEventForm';
import EventTimesSummary from './EventTimesSummary';
import TimeSectionNotification from './TimeSectionNotification';
import { sortRecurringEvents } from './utils';

export interface RecurringEventTabProps {
  eventTimes: EventTime[];
  eventType: string;
  recurringEvents: RecurringEventSettings[];
  setEventTimes: (eventTimes: EventTime[]) => void;
  setRecurringEvents: (recurringEvents: RecurringEventSettings[]) => void;
}

const RecurringEventTab: React.FC<RecurringEventTabProps> = ({
  eventTimes,
  eventType,
  recurringEvents,
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
          />
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

export default RecurringEventTab;
