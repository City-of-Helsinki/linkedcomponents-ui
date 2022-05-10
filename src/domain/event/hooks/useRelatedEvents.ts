import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import React from 'react';

import { EventFieldsFragment, EventsQuery } from '../../../generated/graphql';
import { getRelatedEvents } from '../utils';

type UseRelatedEventsState = {
  events: EventsQuery['events']['data'];
  loading: boolean;
};
// This hook returns all events that should be updated when user saves changes to super event
const useRelatedEvents = (
  event: EventFieldsFragment,
  skip = false
): UseRelatedEventsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [events, setEvents] = React.useState<EventFieldsFragment[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const setRelatedEvents = async () => {
      try {
        setLoading(true);
        const allRelatedEvents = await getRelatedEvents({
          apolloClient,
          event,
        });

        setEvents(allRelatedEvents);
        setLoading(false);
      } catch (error) /* istanbul ignore next */ {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch related events with error', error);
        setLoading(false);
      }
    };

    if (!skip) {
      setRelatedEvents();
    }
  }, [apolloClient, event, setEvents, skip]);

  return { events, loading };
};

export default useRelatedEvents;
