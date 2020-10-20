import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';

import { LanguagesResponse } from '../../../generated/graphql';
import { normalizeKey } from '../../../utils/apolloUtils';

const cache = new InMemoryCache();

const linkedEventsLink = new RestLink({
  fieldNameNormalizer: normalizeKey,
  headers: {
    'Content-Type': 'application/json',
  },
  typePatcher: {
    LanguagesResponse: (data: LanguagesResponse): LanguagesResponse => {
      data.meta = {
        ...data.meta,
        __typename: 'Meta',
      };
      data.data = data.data.map((language) => ({
        ...language,
        name: {
          ...language?.name,
          __typename: 'LocalisedObject',
        },
        __typename: 'Language',
      }));
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
