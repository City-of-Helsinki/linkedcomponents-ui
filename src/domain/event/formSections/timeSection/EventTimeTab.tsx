import React from 'react';
import { useTranslation } from 'react-i18next';

import FieldColumn from '../../layout/FieldColumn';
import FieldRow from '../../layout/FieldRow';
import { EventTime } from '../../types';
import AddEventTimeForm from './AddEventTimeForm';
import EventTimesSummary from './EventTimesSummary';
import TimeSectionContext from './TimeSectionContext';
import TimeSectionNotification from './TimeSectionNotification';
import { sortEventTimes } from './utils';
import ValidationError from './ValidationError';

const EventTimeTab: React.FC = () => {
  const { t } = useTranslation();
  const { eventTimes, eventType, setEventTimes } = React.useContext(
    TimeSectionContext
  );

  const addEventTime = (eventTime: EventTime) => {
    const sortedEventTimes = [...eventTimes];
    sortedEventTimes.push(eventTime);
    sortedEventTimes.sort(sortEventTimes);
    setEventTimes(sortedEventTimes);
  };

  return (
    <>
      <h3>{t(`event.form.titleEnterEventTime.${eventType}`)}</h3>
      <FieldRow notification={<TimeSectionNotification />}>
        <FieldColumn>
          <AddEventTimeForm addEventTime={addEventTime} />
          <ValidationError />
        </FieldColumn>
        <EventTimesSummary />
      </FieldRow>
    </>
  );
};

export default EventTimeTab;
