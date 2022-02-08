import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import capitalize from 'lodash/capitalize';

import {
  EventTypeId,
  RegistrationQueryVariables,
  RegistrationsQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import addParamsToQueryString from '../../utils/addParamsToQueryString';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import { getSearchQuery } from '../../utils/searchUtils';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { EVENT_TYPE } from '../event/constants';
import {
  DEFAULT_REGISTRATION_SORT,
  REGISTRATION_SEARCH_PARAMS,
  REGISTRATION_SORT_OPTIONS,
  REGISTRATIONS_PAGE_SIZE,
} from './constants';
import {
  RegistrationSearchInitialValues,
  RegistrationSearchParam,
  RegistrationSearchParams,
} from './types';

export const getRegistrationSearchInitialValues = (
  search: string
): RegistrationSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const eventType = searchParams.getAll(
    REGISTRATION_SEARCH_PARAMS.EVENT_TYPE
  ) as EVENT_TYPE[];
  const page = searchParams.get(REGISTRATION_SEARCH_PARAMS.PAGE);
  const sort = searchParams.get(
    REGISTRATION_SEARCH_PARAMS.SORT
  ) as REGISTRATION_SORT_OPTIONS;
  const text = searchParams.get(REGISTRATION_SEARCH_PARAMS.TEXT);

  return {
    eventType,
    page: Number(page) || 1,
    sort: Object.values(REGISTRATION_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_REGISTRATION_SORT,
    text: text || '',
  };
};

export const getRegistrationSearchQuery = (
  params: Omit<RegistrationSearchParams, 'sort'>,
  search = ''
): string => {
  const { sort } = getRegistrationSearchInitialValues(search);

  return getSearchQuery({
    ...params,
    sort: sort !== DEFAULT_REGISTRATION_SORT ? sort : null,
  });
};

export const getRegistrationsQueryVariables = (
  search: string
): RegistrationsQueryVariables => {
  const { eventType, page, text } = getRegistrationSearchInitialValues(search);

  return {
    adminUser: true,
    createPath: getPathBuilder(registrationsPathBuilder),
    eventType: eventType.map((type) => capitalize(type)) as EventTypeId[],
    page,
    pageSize: REGISTRATIONS_PAGE_SIZE,
    text,
  };
};

export const getRegistrationParamValue = ({
  param,
  value,
}: {
  param: RegistrationSearchParam;
  value: string;
}): string => {
  switch (param) {
    case REGISTRATION_SEARCH_PARAMS.ATTENDEE_PAGE:
    case REGISTRATION_SEARCH_PARAMS.ENROLMENT_TEXT:
    case REGISTRATION_SEARCH_PARAMS.EVENT_TYPE:
    case REGISTRATION_SEARCH_PARAMS.PAGE:
    case REGISTRATION_SEARCH_PARAMS.SORT:
    case REGISTRATION_SEARCH_PARAMS.TEXT:
    case REGISTRATION_SEARCH_PARAMS.WAITING_PAGE:
      return value;
    case REGISTRATION_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown registration query parameter');
  }
};

export const addParamsToRegistrationQueryString = (
  queryString: string,
  queryParams: Partial<RegistrationSearchParams>
): string => {
  return addParamsToQueryString<RegistrationSearchParams>(
    queryString,
    queryParams,
    getRegistrationParamValue
  );
};

export const replaceParamsToRegistrationQueryString = (
  queryString: string,
  queryParams: Partial<RegistrationSearchParams>
): string => {
  return replaceParamsToQueryString<RegistrationSearchParams>(
    queryString,
    queryParams,
    getRegistrationParamValue
  );
};

/* istanbul ignore next */
export const clearRegistrationQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: RegistrationQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'registration',
    args,
  });

export const clearRegistrationsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'registrations',
  });

export const registrationsPathBuilder = ({
  args,
}: PathBuilderProps<RegistrationsQueryVariables>): string => {
  const { adminUser, eventType, page, pageSize, text } = args;

  const variableToKeyItems = [
    { key: 'admin_user', value: adminUser },
    {
      key: 'event_type',
      value: eventType?.length ? eventType : Object.values(EventTypeId),
    },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'text', value: text },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/registration/${query}`;
};
