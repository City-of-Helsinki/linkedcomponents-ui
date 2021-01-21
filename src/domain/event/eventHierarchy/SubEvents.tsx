import { LoadingSpinner } from 'hds-react';
import React from 'react';

import {
  EventFieldsFragment,
  useEventsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import { EVENT_SORT_OPTIONS } from '../../events/constants';
import { eventsPathBuilder } from '../../events/utils';
import { getEventFields } from '../utils';
import EventHierarchyRow from './EventHierarchyRow';

const PAGE_SIZE = 100;

interface SubEventsProps {
  closedIds: string[];
  event: EventFieldsFragment;
  toggle: (id: string) => void;
}

const SubEvents: React.FC<SubEventsProps> = ({ closedIds, event, toggle }) => {
  const locale = useLocale();
  const { id, name, subEventAtIds, startTime, superEventType } = getEventFields(
    event,
    locale
  );
  const open = !closedIds.includes(id);

  const variables = React.useMemo(() => {
    return {
      createPath: getPathBuilder(eventsPathBuilder),
      pageSize: PAGE_SIZE,
      showAll: true,
      sort: EVENT_SORT_OPTIONS.START_TIME,
      superEvent: id,
    };
  }, [id]);

  const { data, fetchMore, loading } = useEventsQuery({
    skip: !subEventAtIds.length,
    variables,
  });

  const nextPage = React.useMemo(() => {
    const meta = data?.events.meta;
    return meta ? getNextPage(meta) : null;
  }, [data]);

  const subEvents = data?.events.data || [];

  React.useEffect(() => {
    if (nextPage) {
      fetchMore({
        updateQuery: (prev, { fetchMoreResult }) => {
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

  return (
    <>
      <EventHierarchyRow
        id={id}
        level={1}
        name={name}
        open={open}
        startTime={startTime}
        superEventType={superEventType}
        toggle={!!subEventAtIds.length ? toggle : undefined}
      />

      {loading ? (
        <LoadingSpinner small={true} />
      ) : (
        <>
          {open &&
            subEvents.map((subEvent) => {
              const {
                id: subEventId,
                name: subEventName,
                startTime: subEventStartTime,
              } = getEventFields(subEvent as EventFieldsFragment, locale);

              return (
                <EventHierarchyRow
                  key={subEventId}
                  id={subEventId}
                  level={2}
                  name={subEventName}
                  startTime={subEventStartTime}
                  superEventType={null}
                />
              );
            })}
        </>
      )}
    </>
  );
};

export default SubEvents;
