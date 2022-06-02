import React from 'react';

import FieldColumn from '../../../../app/layout/fieldColumn/FieldColumn';
import EventTimesTable from '../eventTimesTable/EventTimesTable';
import RecurringEvents from '../recurringEvents/RecurringEvents';
import SavedEvents from '../savedEvents/SavedEvents';
import styles from '../timeSection.module.scss';
import TimeSectionContext from '../TimeSectionContext';

const EventTimesSummary: React.FC = () => {
  const { events, eventTimes, recurringEvents, setEventTimes } =
    React.useContext(TimeSectionContext);
  const isVisible =
    events?.length || eventTimes?.length || recurringEvents?.length;

  if (!isVisible) {
    return null;
  }

  const getStartIndex = () => {
    let startIndex = 1 + events.length;
    recurringEvents.forEach((recurringEvent) => {
      startIndex = startIndex + recurringEvent.eventTimes.length;
    });
    return startIndex;
  };

  return (
    <div>
      <FieldColumn>
        <div className={styles.divider} />
        <SavedEvents />
      </FieldColumn>

      <RecurringEvents />
      <FieldColumn>
        <EventTimesTable
          eventTimes={eventTimes}
          setEventTimes={setEventTimes}
          startIndex={getStartIndex()}
        />
      </FieldColumn>
    </div>
  );
};

export default EventTimesSummary;
