import React from 'react';
import { useTranslation } from 'react-i18next';

import Collapsible from '../../../../common/components/collapsible/Collapsible';
import FormGroup from '../../../../common/components/formGroup/FormGroup';
import { DATETIME_FORMAT } from '../../../../constants';
import { SuperEventType } from '../../../../generated/graphql';
import formatDate from '../../../../utils/formatDate';
import EventTimesTable from './EventTimesTable';
import TimeSectionContext from './TimeSectionContext';

const SavedEvents: React.FC = () => {
  const { t } = useTranslation();
  const { events, setEvents, savedEvent } = React.useContext(
    TimeSectionContext
  );
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
          <EventTimesTable eventTimes={events} setEventTimes={setEvents} />
        </Collapsible>
      ) : (
        <EventTimesTable eventTimes={events} setEventTimes={setEvents} />
      )}
    </FormGroup>
  );
};

export default SavedEvents;
