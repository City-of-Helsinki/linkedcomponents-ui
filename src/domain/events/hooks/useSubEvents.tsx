import React from 'react';

import { MAX_PAGE_SIZE } from '../../../constants';
import {
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import { eventsPathBuilder } from '../utils';

const useSubEvents = ({
  skip,
  superEventId,
  variableOverrides,
}: {
  skip?: boolean;
  superEventId: string;
  variableOverrides?: Partial<EventsQueryVariables>;
}) => {
  const variables = React.useMemo(() => {
    return {
      createPath: getPathBuilder(eventsPathBuilder),
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
