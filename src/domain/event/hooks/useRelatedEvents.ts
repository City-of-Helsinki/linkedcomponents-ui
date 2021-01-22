import { useApolloClient } from '@apollo/client';
import React from 'react';

import { EventFieldsFragment } from '../../../generated/graphql';
import { getRelatedEvents } from '../utils';

const useRelatedEvents = (event: EventFieldsFragment) => {
  const apolloClient = useApolloClient();
  const subEvents = event.subEvents;
  const [allEvents, setAllEvents] = React.useState<EventFieldsFragment[]>([]);

  React.useEffect(() => {
    const setRelatedEvents = async () => {
      try {
        const allRelatedEvents = await getRelatedEvents({
          apolloClient,
          event,
        });

        setAllEvents(allRelatedEvents);
      } catch (error) {
        /* istanbul ignore next */
        // eslint-disable-next-line no-console
        console.error('Failed to fetch related events with error', error);
      }
    };
    setRelatedEvents();
  }, [apolloClient, event, setAllEvents, subEvents]);

  return allEvents;
};

export default useRelatedEvents;
