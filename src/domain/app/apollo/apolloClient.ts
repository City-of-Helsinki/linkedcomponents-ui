import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { RestLink } from 'apollo-link-rest';

import {
  Event,
  EventsResponse,
  Keyword,
  KeywordSet,
  KeywordSetsResponse,
  KeywordsResponse,
  LanguagesResponse,
  Place,
  PlacesResponse,
} from '../../../generated/graphql';
import { normalizeKey } from '../../../utils/apolloUtils';
import { apiTokenSelector } from '../../auth/selectors';
import i18n from '../i18n/i18nInit';
import { store } from '../store/store';
import {
  addTypenameEvent,
  addTypenameKeyword,
  addTypenameKeywordSet,
  addTypenameLanguage,
  addTypenameMeta,
  addTypenamePlace,
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
        keyword(_, { args, toReference }) {
          return toReference({
            __typename: 'Keyword',
            id: args?.id,
          });
        },
        keywordSet(_, { args, toReference }) {
          return toReference({
            __typename: 'KeywordSet',
            id: args?.id,
          });
        },
        place(_, { args, toReference }) {
          return toReference({
            __typename: 'Place',
            id: args?.id,
          });
        },
      },
    },
  },
});

const authLink = setContext((_, { headers }) => {
  const token = apiTokenSelector(store.getState());

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
      'Accept-language': i18n.language,
    },
  };
});

const linkedEventsLink = new RestLink({
  fieldNameNormalizer: normalizeKey,
  headers: {
    'Content-Type': 'application/json',
  },
  typePatcher: {
    Event: (event: Event): Event | null => {
      return addTypenameEvent(event);
    },
    EventsResponse: (data: EventsResponse): EventsResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((event) => addTypenameEvent(event));

      return data;
    },
    Keyword: (keyword: Keyword): Keyword | null => {
      return addTypenameKeyword(keyword);
    },
    KeywordsResponse: (data: KeywordsResponse): KeywordsResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((keyword) => addTypenameKeyword(keyword));

      return data;
    },
    KeywordSet: (keywordSet: KeywordSet): KeywordSet | null => {
      return addTypenameKeywordSet(keywordSet);
    },
    KeywordSetsResponse: (data: KeywordSetsResponse): KeywordSetsResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((keywordSet) =>
        addTypenameKeywordSet(keywordSet)
      );

      return data;
    },
    LanguagesResponse: (data: LanguagesResponse): LanguagesResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((language) => addTypenameLanguage(language));

      return data;
    },
    Place: (place: Place): Place | null => {
      return addTypenamePlace(place);
    },
    PlacesResponse: (data: PlacesResponse): PlacesResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((place) => addTypenamePlace(place));

      return data;
    },
  },
  uri: process.env.REACT_APP_LINKED_EVENTS_URL,
});

const apolloClient = new ApolloClient({
  cache,
  link: ApolloLink.from([authLink, linkedEventsLink]),
});

export default apolloClient;
