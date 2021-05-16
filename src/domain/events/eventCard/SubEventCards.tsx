import React from 'react';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { useNocacheContext } from '../../../common/components/nocache/NocacheContext';
import useSubEvents from '../hooks/useSubEvents';
import EventCard from './EventCard';
import styles from './eventCard.module.scss';

interface Props {
  eventId: string;
  level: number;
}

const SubEventRows: React.FC<Props> = ({ eventId, level }) => {
  const { nocache } = useNocacheContext();
  const { subEvents, loading } = useSubEvents({
    nocache,
    superEventId: eventId,
  });

  return loading ? (
    <div style={{ paddingLeft: `calc(${level} * var(--spacing-l))` }}>
      <LoadingSpinner
        className={styles.loadingSpinner}
        isLoading={loading}
        small={true}
      />
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
