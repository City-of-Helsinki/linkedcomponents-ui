import { ApolloClient, useApolloClient } from '@apollo/client';
import React from 'react';

import { EventFieldsFragment } from '../../../generated/graphql';
import { getRelatedEvents } from '../utils';

type UseRelatedEventsState = {
  events: EventFieldsFragment[];
  loading: boolean;
};
// This hook returns all events that should be updated when user saves changes to super event
const useRelatedEvents = (
  event: EventFieldsFragment
): UseRelatedEventsState => {
  const apolloClient = useApolloClient() as ApolloClient<
    Record<string, unknown>
  >;
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

    setRelatedEvents();
  }, [apolloClient, event, setEvents]);

  return { events, loading };
};

export default useRelatedEvents;
