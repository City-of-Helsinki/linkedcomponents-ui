import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';

import {
  Event,
  EventsResponse,
  LanguagesResponse,
} from '../../../generated/graphql';
import { normalizeKey } from '../../../utils/apolloUtils';
import {
  addTypenameEvent,
  addTypenameLanguage,
  addTypenameMeta,
} from './utils';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        event(_, { args, toReference }) {
          return toReference({
            __typename: 'Event',
            id: args?.id,
          });
        },
      },
    },
  },
});

const linkedEventsLink = new RestLink({
  fieldNameNormalizer: normalizeKey,
  headers: {
    'Content-Type': 'application/json',
  },
  typePatcher: {
    LanguagesResponse: (data: LanguagesResponse): LanguagesResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((language) => addTypenameLanguage(language));

      return data;
    },
    Event: (event: Event): Event | null => {
      return addTypenameEvent(event);
    },
    EventsResponse: (data: EventsResponse): EventsResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((event) => addTypenameEvent(event));

      return data;
    },
  },
  uri: process.env.REACT_APP_LINKED_EVENTS_URL,
});

const apolloClient = new ApolloClient({
  cache,
  link: ApolloLink.from([linkedEventsLink]),
});

export default apolloClient;
