import React from 'react';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { EventFieldsFragment } from '../../../generated/graphql';
import useSubEvents from '../hooks/useSubEvents';
import styles from './eventsTable.module.scss';
import EventTableRow from './EventsTableRow';

interface Props {
  eventId: string;
  level: number;
  onRowClick: (event: EventFieldsFragment) => void;
}

const SubEventRows: React.FC<Props> = ({ eventId, level, onRowClick }) => {
  const { subEvents, loading } = useSubEvents({
    superEventId: eventId,
  });

  return loading ? (
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
  ) : (
    <>
      {subEvents.map((event, index) => {
        return (
          event && (
            <EventTableRow
              key={event.id}
              hideBorder={index + 1 !== subEvents.length}
              event={event}
              level={level + 1}
              onRowClick={onRowClick}
            />
          )
        );
      })}
    </>
  );
};

export default SubEventRows;
