import React from 'react';

import FieldColumn from '../../../../app/layout/fieldColumn/FieldColumn';
import EventTimesTable from '../eventTimesTable/EventTimesTable';
import useTimeSectionContext from '../hooks/useTimeSectionContext';
import RecurringEvents from '../recurringEvents/RecurringEvents';
import SavedEvents from '../savedEvents/SavedEvents';
import styles from '../timeSection.module.scss';

const EventTimesSummary: React.FC = () => {
  const { events, eventTimes, recurringEvents, setEventTimes } =
    useTimeSectionContext();

  const isVisible =
    events?.length || eventTimes?.length || recurringEvents?.length;

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <FieldColumn>
        <div className={styles.divider} />
        <SavedEvents />
      </FieldColumn>

      <RecurringEvents />
      <FieldColumn>
        <EventTimesTable
          eventTimes={eventTimes}
          setEventTimes={setEventTimes}
        />
      </FieldColumn>
    </>
  );
};

export default EventTimesSummary;
