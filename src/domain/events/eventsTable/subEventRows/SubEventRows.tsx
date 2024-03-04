import React from 'react';

import LoadingSpinner from '../../../../common/components/loadingSpinner/LoadingSpinner';
import skipFalsyType from '../../../../utils/skipFalsyType';
import useSubEvents from '../../hooks/useSubEvents';
import EventTableRow from '../eventsTableRow/EventsTableRow';
import styles from './subEventRows.module.scss';

interface Props {
  eventId: string;
  level: number;
}

const SubEventRows: React.FC<Props> = ({ eventId, level }) => {
  const { subEvents, loading } = useSubEvents({
    superEventId: eventId,
  });

  if (loading) {
    return (
      <tr>
        <td colSpan={6}>
          <div style={{ paddingLeft: `calc(${level} * var(--spacing-m))` }}>
            <LoadingSpinner
              className={styles.loadingSpinner}
              isLoading={loading}
              small={true}
            />
          </div>
        </td>
      </tr>
    );
  }

  return subEvents
    .filter(skipFalsyType)
    .map((event, index) => (
      <EventTableRow
        key={event.id}
        hideBorder={index + 1 !== subEvents.length}
        event={event}
        level={level + 1}
      />
    ));
};

export default SubEventRows;
