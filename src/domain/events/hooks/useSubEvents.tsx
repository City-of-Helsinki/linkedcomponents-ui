import React from 'react';

import {
  EventsQuery,
  EventsQueryVariables,
  useEventsQuery,
} from '../../../generated/graphql';
import getNextPage from '../../../utils/getNextPage';
import { SUB_EVENTS_VARIABLES } from '../../event/constants';

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
      ...SUB_EVENTS_VARIABLES,
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
