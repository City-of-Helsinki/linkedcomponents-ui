import {
  ApolloClient,
  ApolloLink,
  FieldMergeFunction,
  FieldReadFunction,
  InMemoryCache,
  ServerError,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/react';
import { RestLink } from 'apollo-link-rest';
import { SentryLink } from 'apollo-link-sentry';
import snakeCase from 'lodash/snakeCase';
import { toast } from 'react-toastify';

import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../../constants';
import {
  Enrolment,
  Event,
  EventsResponse,
  Image,
  ImagesResponse,
  Keyword,
  KeywordSet,
  KeywordSetsResponse,
  KeywordsResponse,
  LanguagesResponse,
  Organization,
  OrganizationsResponse,
  Place,
  PlacesResponse,
  Registration,
  RegistrationsResponse,
  UploadImageMutationInput,
} from '../../../generated/graphql';
import { normalizeKey } from '../../../utils/apolloUtils';
import generateAtId from '../../../utils/generateAtId';
import { apiTokenSelector } from '../../auth/selectors';
import i18n from '../i18n/i18nInit';
import { store } from '../store/store';
import {
  addTypenameEnrolment,
  addTypenameEvent,
  addTypenameImage,
  addTypenameKeyword,
  addTypenameKeywordSet,
  addTypenameLanguage,
  addTypenameMeta,
  addTypenameOrganization,
  addTypenamePlace,
  addTypenameRegistration,
} from './utils';

// This serializer is needed to send image upload data to API as multipart/form-data content.
// Apollo sets Content-type to application/json by default and we need to delete Content-type
// from the header so fetch can automatically identify content type to be multipart/form-data
// and sets boundary correctly
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

  // Delete Content-Type header so browsers will detect Content-Type automatically
  // and set correct boundary
  headers.delete('content-type');

  return {
    body: formData,
    headers,
  };
};

const mergeCache: FieldMergeFunction = (existing, incoming, { args }) => {
  if (!existing) return incoming;
  if (!incoming) return existing;

  const page = args?.page ?? 1;
  const pageSize = Math.min(args?.pageSize ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const offset = (page - 1) * pageSize;

  const mergedImages = existing ? [...existing.data] : [];

  for (let i = 0; i < incoming.data.length; i = i + 1) {
    mergedImages[offset + i] = incoming.data[i];
  }

  return { ...incoming, data: mergedImages };
};

const keyFields = ['atId', 'id'];

const fieldFunction =
  (typename: string, endpoint: string): FieldReadFunction =>
  (_, { args, toReference }) => {
    const id = args?.id;
    return toReference({
      __typename: typename,
      atId: generateAtId(id, endpoint),
      id,
    });
  };

export const createCache = (): InMemoryCache =>
  new InMemoryCache({
    typePolicies: {
      Event: { keyFields },
      Keyword: { keyFields },
      KeywordSet: { keyFields },
      Organization: { keyFields },
      Place: { keyFields },
      Query: {
        fields: {
          event: fieldFunction('Event', 'event'),
          events: {
            keyArgs: (args) => {
              if (args?.superEvent && args?.superEvent !== 'none') {
                return Object.keys(args).filter((arg) => arg !== 'page');
              }
              return args ? Object.keys(args) : [];
            },
            merge(existing, incoming, options) {
              const { args } = options;

              if (args?.superEvent && args?.superEvent !== 'none') {
                return mergeCache(existing, incoming, options);
              }
              return incoming;
            },
          },
          images: {
            keyArgs: (args) =>
              args ? Object.keys(args).filter((arg) => arg !== 'page') : [],
            merge(existing, incoming, options) {
              return mergeCache(existing, incoming, options);
            },
          },
          image(_, { args, toReference }) {
            return toReference({
              __typename: 'Image',
              id: args?.id,
            });
          },
          keyword: fieldFunction('Keyword', 'keyword'),
          keywordSet: fieldFunction('KeywordSet', 'keyword_set'),
          organization: fieldFunction('Organization', 'organization'),
          place: fieldFunction('Place', 'place'),
        },
      },
      Registration: {
        fields: {
          signups: {
            // Short for always preferring incoming over existing data.
            merge: false,
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

const addNocacheToUrl = (urlStr: string): string => {
  const url = new URL(urlStr);
  const searchParams = new URLSearchParams(url.search);

  if (!searchParams.get('nocache')) {
    searchParams.append('nocache', 'true');
  }

  url.search = searchParams.toString();

  return url.toString();
};

const linkedEventsLink = new RestLink({
  bodySerializers: {
    uploadImageSerializer,
  },
  customFetch: (request: Request | string, config) => {
    if (typeof request === 'string') {
      const requestParts = request
        .replace(process.env.REACT_APP_LINKED_EVENTS_URL || '', '')
        .split('/')
        .filter((t) => t);

      if (config.method === 'GET') {
        return fetch(addNocacheToUrl(request), config);
      } else if (config.method === 'DELETE' && requestParts[0] === 'signup') {
        // Apollo cleans body from delete request so parse cancellation code
        // from the request to make this to work with LE API
        return fetch(request.replace(requestParts[1], ''), {
          ...config,
          body: JSON.stringify({ cancellation_code: requestParts[1] }),
        });
      }
    }

    return fetch(request, config);
  },
  fieldNameDenormalizer: (key) => {
    if (key === 'atId') {
      return '@id';
    }

    return snakeCase(key);
  },
  fieldNameNormalizer: normalizeKey,
  headers: {
    'Content-Type': 'application/json',
  },
  typePatcher: {
    Enrolment: (enrolment: Enrolment): Enrolment | null =>
      addTypenameEnrolment(enrolment),
    Event: (event: Event): Event | null => addTypenameEvent(event),
    EventsResponse: (data: EventsResponse): EventsResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((event) => addTypenameEvent(event));

      return data;
    },
    Image: (image: Image): Image | null => addTypenameImage(image),
    ImagesResponse: (data: ImagesResponse): ImagesResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((image) => addTypenameImage(image));

      return data;
    },
    Keyword: (keyword: Keyword): Keyword | null => addTypenameKeyword(keyword),
    KeywordsResponse: (data: KeywordsResponse): KeywordsResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((keyword) => addTypenameKeyword(keyword));

      return data;
    },
    KeywordSet: (keywordSet: KeywordSet): KeywordSet | null =>
      addTypenameKeywordSet(keywordSet),
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
    Organization: (organization: Organization): Organization | null =>
      addTypenameOrganization(organization),
    OrganizationsResponse: (
      data: OrganizationsResponse
    ): OrganizationsResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((organization) =>
        addTypenameOrganization(organization)
      );

      return data;
    },
    Place: (place: Place): Place | null => addTypenamePlace(place),
    PlacesResponse: (data: PlacesResponse): PlacesResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((place) => addTypenamePlace(place));

      return data;
    },
    Registration: (registration: Registration): Registration | null =>
      addTypenameRegistration(registration),
    RegistrationsResponse: (
      data: RegistrationsResponse
    ): RegistrationsResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((registration) =>
        addTypenameRegistration(registration)
      );

      return data;
    },
  },
  uri: process.env.REACT_APP_LINKED_EVENTS_URL,
});

const QUERIES_TO_SHOW_ERROR = ['User'];
const MUTATIONS_NOT_TO_SHOW_VALIDATION_ERROR = [
  'CreateEvent',
  'CreateEvents',
  'PostFeedback',
  'PostGuestFeedback',
];

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  const isMutation = Boolean(
    operation.query.definitions.find(
      (definition) =>
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'mutation'
    )
  );

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      const errorMessage = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`;
      Sentry.captureMessage(errorMessage);
    });
  }

  if (
    (isMutation || QUERIES_TO_SHOW_ERROR.includes(operation.operationName)) &&
    networkError
  ) {
    switch ((networkError as ServerError).statusCode) {
      case 400:
        if (
          !MUTATIONS_NOT_TO_SHOW_VALIDATION_ERROR.includes(
            operation.operationName
          )
        ) {
          toast.error(i18n.t('errors.validationError'));
        }
        break;
      case 401:
        toast.error(i18n.t('errors.authorizationRequired'));
        break;
      case 403:
        toast.error(i18n.t('errors.forbidden'));
        break;
      case 404:
        toast.error(i18n.t('errors.notFound'));
        break;
      case 410:
        toast.error(i18n.t('errors.deleted'));
        break;
      default:
        toast.error(i18n.t('errors.serverError'));
    }
  }
});

const sentryLink = new SentryLink({
  attachBreadcrumbs: {
    includeQuery: true,
    includeFetchResult: true,
    includeVariables: true,
    includeError: true,
  },
  // Send only mutation details to Sentry
  shouldHandleOperation: (operation) =>
    operation.query.definitions.some(
      (definition) =>
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'mutation'
    ),
});

const apolloClient = new ApolloClient({
  cache: createCache(),
  link: ApolloLink.from([errorLink, sentryLink, authLink, linkedEventsLink]),
});

export default apolloClient;
