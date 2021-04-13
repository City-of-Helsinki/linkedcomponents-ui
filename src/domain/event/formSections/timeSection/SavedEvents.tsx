import React from 'react';
import { useTranslation } from 'react-i18next';

import Collapsible from '../../../../common/components/collapsible/Collapsible';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { DATETIME_FORMAT } from '../../../../constants';
import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../generated/graphql';
import formatDate from '../../../../utils/formatDate';
import { EventTime } from '../../types';
import EventTimesTable from './EventTimesTable';

interface Props {
  events: EventTime[];
  eventType: string;
  savedEvent?: EventFieldsFragment;
  setEvents: (eventTimes: EventTime[]) => void;
}

const SavedEvents: React.FC<Props> = ({
  events,
  eventType,
  savedEvent,
  setEvents,
}) => {
  const { t } = useTranslation();
  const isRecurringEvent =
    savedEvent?.superEventType === SuperEventType.Recurring;

  if (!savedEvent) {
    return null;
  }

  return (
    <FormGroup>
      {isRecurringEvent ? (
        <Collapsible
          defaultOpen={true}
          headingLevel={3}
          title={t('common.betweenDates', {
            startDate:
              savedEvent.startTime &&
              formatDate(new Date(savedEvent.startTime), DATETIME_FORMAT),
            endDate:
              savedEvent.endTime &&
              formatDate(new Date(savedEvent.endTime), DATETIME_FORMAT),
          })}
        >
          <EventTimesTable
            eventTimes={events}
            eventType={eventType}
            setEventTimes={setEvents}
          />
        </Collapsible>
      ) : (
        <EventTimesTable
          eventTimes={events}
          eventType={eventType}
          setEventTimes={setEvents}
        />
      )}
    </FormGroup>
  );
};

export default SavedEvents;
