import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';

import { normalizeKey } from '../../../utils/apolloUtils';

const cache = new InMemoryCache();

const linkedEventsLink = new RestLink({
  fieldNameNormalizer: normalizeKey,
  headers: {
    'Content-Type': 'application/json',
  },
  uri: process.env.REACT_APP_LINKED_EVENTS_URL,
});

const apolloClient = new ApolloClient({
  cache,
  link: ApolloLink.from([linkedEventsLink]),
});

export default apolloClient;
