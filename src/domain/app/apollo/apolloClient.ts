import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { RestLink } from 'apollo-link-rest';
import snakeCase from 'lodash/snakeCase';

import {
  Event,
  EventsResponse,
  Image,
  ImagesResponse,
  Keyword,
  KeywordSet,
  KeywordSetsResponse,
  KeywordsResponse,
  LanguagesResponse,
  Place,
  PlacesResponse,
  UploadImageMutationInput,
} from '../../../generated/graphql';
import { normalizeKey } from '../../../utils/apolloUtils';
import { apiTokenSelector } from '../../auth/selectors';
import i18n from '../i18n/i18nInit';
import { store } from '../store/store';
import {
  addTypenameEvent,
  addTypenameImage,
  addTypenameKeyword,
  addTypenameKeywordSet,
  addTypenameLanguage,
  addTypenameMeta,
  addTypenamePlace,
} from './utils';

const uploadImageSerializer = (
  data: UploadImageMutationInput,
  headers: Headers
) => {
  const formData = new FormData();
  const { image, url, ...restFields } = data;

  data.image
    ? formData.append('image', image)
    : formData.append('url', url || '');

  for (const key in restFields) {
    if (restFields.hasOwnProperty(key)) {
      formData.append(
        snakeCase(key),
        restFields[key as keyof typeof restFields] || ''
      );
    }
  }

  // TODO: Apikey authentication is used only for local testing. Reason for this
  // is that OpenId authentication is not yet implemented on BE side
  // Remove apikey header when authentication is ready
  headers.set('apikey', '84f869cd-8e33-4d19-b54b-673e63d29df1');

  // Delete Content-Type header so browsers will detect Content-Type automatically
  // and set correct boundary
  headers.delete('content-type');

  return {
    body: formData,
    headers,
  };
};

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
        image(_, { args, toReference }) {
          return toReference({
            __typename: 'Image',
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
  bodySerializers: {
    uploadImageSerializer,
  },
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
    Image: (image: Image): Image | null => {
      return addTypenameImage(image);
    },
    ImagesResponse: (data: ImagesResponse): ImagesResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((image) => addTypenameImage(image));

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
