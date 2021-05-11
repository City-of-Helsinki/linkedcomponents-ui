import React from 'react';

import { MAX_PAGE_SIZE } from '../../../constants';
import {
  EventsQuery,
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import { EVENT_LIST_INCLUDES } from '../constants';
import { eventsPathBuilder } from '../utils';

type UseSubEventsState = {
  loading: boolean;
  subEvents: EventsQuery['events']['data'];
};

const useSubEvents = ({
  skip,
  superEventId,
  variableOverrides,
}: {
  skip?: boolean;
  superEventId: string;
  variableOverrides?: Partial<EventsQueryVariables>;
}): UseSubEventsState => {
  const variables = React.useMemo(() => {
    return {
      createPath: getPathBuilder(eventsPathBuilder),
      include: EVENT_LIST_INCLUDES,
      pageSize: MAX_PAGE_SIZE,
      showAll: true,
      superEvent: superEventId,
      ...variableOverrides,
    };
  }, [superEventId, variableOverrides]);

  const { data, fetchMore, loading } = useEventsQuery({
    skip,
    variables,
  });

  const nextPage = React.useMemo(() => {
    const meta = data?.events.meta;
    return meta ? getNextPage(meta) : null;
  }, [data]);

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

  const subEvents = data?.events.data || [];

  return { subEvents, loading };
};

export default useSubEvents;
