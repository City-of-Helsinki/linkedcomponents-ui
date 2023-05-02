import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Collapsible from '../../../../../common/components/collapsible/Collapsible';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import { DATETIME_FORMAT } from '../../../../../constants';
import { SuperEventType } from '../../../../../generated/graphql';
import formatDate from '../../../../../utils/formatDate';
import getDateFromString from '../../../../../utils/getDateFromString';
import EventTimesTable from '../eventTimesTable/EventTimesTable';
import useTimeSectionContext from '../hooks/useTimeSectionContext';

const SavedEvents: React.FC = () => {
  const { t } = useTranslation();
  const { events, setEvents, savedEvent } = useTimeSectionContext();
  const isRecurringEvent =
    savedEvent?.superEventType === SuperEventType.Recurring;

  const { end, start } = useMemo(() => {
    return {
      end: getDateFromString(savedEvent?.endTime),
      start: getDateFromString(savedEvent?.startTime),
    };
  }, [savedEvent]);

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
            startDate: start && formatDate(start, DATETIME_FORMAT),
            endDate: end && formatDate(end, DATETIME_FORMAT),
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
