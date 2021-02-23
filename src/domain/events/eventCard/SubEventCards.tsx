import { LoadingSpinner } from 'hds-react';
import React from 'react';

import useSubEvents from '../hooks/useSubEvents';
import EventCard from './EventCard';

interface Props {
  eventId: string;
  level: number;
}

const SubEventRows: React.FC<Props> = ({ eventId, level }) => {
  const { subEvents, loading } = useSubEvents({ superEventId: eventId });

  return loading ? (
    <div style={{ paddingLeft: `calc(${level} * var(--spacing-l))` }}>
      <LoadingSpinner small={true} />
    </div>
  ) : (
    <>
      {subEvents.map((event) => {
        return (
          event && <EventCard key={event.id} event={event} level={level} />
        );
      })}
    </>
  );
};

export default SubEventRows;
