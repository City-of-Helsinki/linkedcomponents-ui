import { LoadingSpinner } from 'hds-react';
import React from 'react';

import { MAX_PAGE_SIZE } from '../../../constants';
import { useEventsQuery } from '../../../generated/graphql';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import { eventsPathBuilder } from '../utils';
import EventTableRow, { PADDING } from './EventsTableRow';

interface Props {
  eventId: string;
  level: number;
}

const SubEventRows: React.FC<Props> = ({ eventId, level }) => {
  const variables = React.useMemo(() => {
    return {
      createPath: getPathBuilder(eventsPathBuilder),
      pageSize: MAX_PAGE_SIZE,
      showAll: true,
      superEvent: eventId,
    };
  }, [eventId]);

  const { data, fetchMore, loading } = useEventsQuery({
    variables,
  });

  const nextPage = React.useMemo(() => {
    const meta = data?.events.meta;
    return meta ? getNextPage(meta) : null;
  }, [data]);

  const events = data?.events.data || [];

  React.useEffect(() => {
    if (nextPage) {
      fetchMore({
        updateQuery: (prev, { fetchMoreResult }) => {
          /* istanbul ignore next */
          if (!fetchMoreResult) return prev;

          const events = [...prev.events.data, ...fetchMoreResult.events.data];
          fetchMoreResult.events.data = events;
          return fetchMoreResult;
        },
        variables: {
          ...variables,
          page: nextPage,
        },
      });
    }
  }, [fetchMore, nextPage, variables]);

  return loading ? (
    <tr>
      <td colSpan={6}>
        <div style={{ paddingLeft: level * PADDING }}>
          <LoadingSpinner small={true} />
        </div>
      </td>
    </tr>
  ) : (
    <>
      {events.map((event, index) => {
        return (
          event && (
            <EventTableRow
              key={event.id}
              hideBorder={index + 1 !== events.length}
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
