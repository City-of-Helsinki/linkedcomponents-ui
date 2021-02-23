import { LoadingSpinner } from 'hds-react';
import React from 'react';

import useSubEvents from '../hooks/useSubEvents';
import EventTableRow from './EventsTableRow';

interface Props {
  eventId: string;
  level: number;
}

const SubEventRows: React.FC<Props> = ({ eventId, level }) => {
  const { subEvents, loading } = useSubEvents({ superEventId: eventId });

  return loading ? (
    <tr>
      <td colSpan={6}>
        <div style={{ paddingLeft: `calc(${level} * var(--spacing-m))` }}>
          <LoadingSpinner small={true} />
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
            />
          )
        );
      })}
    </>
  );
};

export default SubEventRows;
