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

import { NotificationProps } from '../../../common/components/notification/Notification';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../../constants';
import {
  DataSource,
  DataSourcesResponse,
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
  OrganizationClass,
  OrganizationClassesResponse,
  OrganizationsResponse,
  Place,
  PlacesResponse,
  Registration,
  RegistrationsResponse,
  Signup,
  SignupGroup,
  SignupsResponse,
  UploadImageMutationInput,
  User,
  UsersResponse,
} from '../../../generated/graphql';
import { normalizeKey } from '../../../utils/apolloUtils';
import { featureFlagUtils } from '../../../utils/featureFlags';
import generateAtId from '../../../utils/generateAtId';
import getValue from '../../../utils/getValue';
import { getApiTokenFromStorage } from '../../auth/utils';
import i18n from '../i18n/i18nInit';
import {
  addTypenameDataSource,
  addTypenameEvent,
  addTypenameImage,
  addTypenameKeyword,
  addTypenameKeywordSet,
  addTypenameLanguage,
  addTypenameMeta,
  addTypenameOrganization,
  addTypenameOrganizationClass,
  addTypenamePlace,
  addTypenameRegistration,
  addTypenameSignup,
  addTypenameSignupGroup,
  addTypenameUser,
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

  for (const [key, value] of Object.entries(restFields)) {
    if (typeof value === 'string') {
      formData.append(snakeCase(key), value || '');
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

  const mergedItems = existing ? [...existing.data] : [];

  for (let i = 0; i < incoming.data.length; i = i + 1) {
    mergedItems[offset + i] = incoming.data[i];
  }

  return { ...incoming, data: mergedItems };
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
      DataSource: { keyFields: ['id'] },
      Event: { keyFields },
      Keyword: { keyFields },
      KeywordSet: { keyFields },
      Organization: { keyFields },
      OrganizationClass: { keyFields: ['id'] },
      Place: { keyFields },
      Query: {
        fields: {
          dataSource: fieldFunction('DataSource', 'DataSource'),
          dataSources: {
            keyArgs: (args) =>
              args ? Object.keys(args).filter((arg) => arg !== 'page') : [],
            merge(existing, incoming, options) {
              return mergeCache(existing, incoming, options);
            },
          },
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
          image: fieldFunction('Image', 'image'),
          images: {
            keyArgs: (args) => {
              if (args?.mergePages) {
                return Object.keys(args).filter((arg) => arg !== 'page');
              }
              return args ? Object.keys(args) : [];
            },
            merge(existing, incoming, options) {
              const { args } = options;

              if (args?.mergePages) {
                return mergeCache(existing, incoming, options);
              }
              return incoming;
            },
          },
          keyword: fieldFunction('Keyword', 'keyword'),
          keywordSet: fieldFunction('KeywordSet', 'keyword_set'),
          organization: fieldFunction('Organization', 'organization'),
          organizations: {
            keyArgs: (args) =>
              args ? Object.keys(args).filter((arg) => arg !== 'page') : [],
            merge(existing, incoming, options) {
              return mergeCache(existing, incoming, options);
            },
          },
          organizationClass: fieldFunction(
            'OrganizationClass',
            'organizationClass'
          ),
          organizationClasses: {
            keyArgs: (args) =>
              args ? Object.keys(args).filter((arg) => arg !== 'page') : [],
            merge(existing, incoming, options) {
              return mergeCache(existing, incoming, options);
            },
          },
          place: fieldFunction('Place', 'place'),
          signupGroup: fieldFunction('SignupGroup', 'signupGroup'),
          users: {
            keyArgs: (args) =>
              args ? Object.keys(args).filter((arg) => arg !== 'page') : [],
            merge(existing, incoming, options) {
              return mergeCache(existing, incoming, options);
            },
          },
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
      User: { keyFields: ['username'] },
    },
  });

const authLink = setContext(async (_, { headers }) => {
  const token = getApiTokenFromStorage();

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
        .replace(import.meta.env.REACT_APP_LINKED_EVENTS_URL || '', '')
        .split('/')
        .filter((t) => t);

      if (config.method === 'GET') {
        return fetch(addNocacheToUrl(request), config);
      } else if (config.method === 'PUT' && requestParts[0] === 'image') {
        // TODO: Remove LOCALIZED_IMAGE feature flag when localized image alt text
        // is deployed to production of API
        const bodyObj = JSON.parse(getValue(config.body?.toString(), ''));

        return fetch(request, {
          ...config,
          body: JSON.stringify({
            ...bodyObj,
            alt_text: featureFlagUtils.isFeatureEnabled('LOCALIZED_IMAGE')
              ? bodyObj.alt_text
              : bodyObj.alt_text?.fi ?? null,
          }),
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
    DataSource: (dataSource: DataSource): DataSource | null =>
      addTypenameDataSource(dataSource),
    DataSourcesResponse: (data: DataSourcesResponse): DataSourcesResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((dataSource) =>
        addTypenameDataSource(dataSource)
      );

      return data;
    },

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
    OrganizationClass: (
      organizationClass: OrganizationClass
    ): OrganizationClass | null =>
      addTypenameOrganizationClass(organizationClass),
    OrganizationClassesResponse: (
      data: OrganizationClassesResponse
    ): OrganizationClassesResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((organizationClass) =>
        addTypenameOrganizationClass(organizationClass)
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
    Signup: (signup: Signup): Signup | null => addTypenameSignup(signup),
    SignupsResponse: (data: SignupsResponse): SignupsResponse => {
      return {
        meta: addTypenameMeta(data.meta),
        data: data.data.map((signup) => addTypenameSignup(signup) as Signup),
      };
    },
    SignupGroup: (signupGroup: SignupGroup): SignupGroup | null =>
      addTypenameSignupGroup(signupGroup),
    User: (user: User): User | null => addTypenameUser(user),
    UsersResponse: (data: UsersResponse): UsersResponse => {
      data.meta = addTypenameMeta(data.meta);
      data.data = data.data.map((user) => addTypenameUser(user));

      return data;
    },
  },
  uri: import.meta.env.REACT_APP_LINKED_EVENTS_URL,
});

const QUERIES_TO_SHOW_ERROR = ['User'];
const MUTATIONS_NOT_TO_SHOW_SERVER_ERROR = [
  'SendRegistrationUserAccessInvitation',
];
const MUTATIONS_NOT_TO_SHOW_VALIDATION_ERROR = [
  'CreateEvent',
  'CreateEvents',
  'CreateKeyword',
  'CreateKeywordSet',
  'CreateOrganization',
  'CreatePlace',
  'PostFeedback',
  'PostGuestFeedback',
  'UpdateKeyword',
  'UpdateKeywordSet',
  'UpdateOrganization',
  'UpdatePlace',
];
const MUTATIONS_NOT_TO_SHOW_FORBIDDEN_ERROR = [
  'CreateKeyword',
  'CreateKeywordSet',
  'CreateOrganization',
  'CreatePlace',
  'UpdateImage',
  'UpdateKeyword',
  'UpdateKeywordSet',
  'UpdateOrganization',
  'UpdatePlace',
];

const getNetworkErrorKey = (
  statusCode: number,
  operationName: string
): string => {
  switch (statusCode) {
    case 400:
      if (!MUTATIONS_NOT_TO_SHOW_VALIDATION_ERROR.includes(operationName)) {
        return 'errors.validationError';
      }
      break;
    case 401:
      return 'errors.authorizationRequired';
    case 403:
      if (!MUTATIONS_NOT_TO_SHOW_FORBIDDEN_ERROR.includes(operationName)) {
        return 'errors.forbidden';
      }
      break;
    case 404:
      return 'errors.notFound';
    case 410:
      return 'errors.deleted';
    default:
      if (!MUTATIONS_NOT_TO_SHOW_SERVER_ERROR.includes(operationName)) {
        return 'errors.serverError';
      }
  }

  return '';
};

const showNetwordErrorNotification = (
  statusCode: number,
  operationName: string,
  addNotification: (props: NotificationProps) => void
) => {
  const errorKey = getNetworkErrorKey(statusCode, operationName);

  if (errorKey) {
    addNotification({
      label: i18n.t(errorKey),
      type: 'error',
    });
  }
};

const createErrorLink = ({
  addNotification,
}: {
  addNotification: (props: NotificationProps) => void;
}) =>
  onError(({ graphQLErrors, networkError, operation }) => {
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
      showNetwordErrorNotification(
        (networkError as ServerError).statusCode,
        operation.operationName,
        addNotification
      );
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

export const createApolloClient = ({
  addNotification,
}: {
  addNotification: (props: NotificationProps) => void;
}) =>
  new ApolloClient({
    cache: createCache(),
    link: ApolloLink.from([
      createErrorLink({ addNotification }),
      sentryLink,
      authLink,
      linkedEventsLink,
    ]),
  });
