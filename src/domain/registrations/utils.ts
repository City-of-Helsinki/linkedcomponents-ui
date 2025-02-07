import capitalize from 'lodash/capitalize';

import {
  EventTypeId,
  RegistrationsQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import addParamsToQueryString from '../../utils/addParamsToQueryString';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import { getSearchQuery } from '../../utils/searchUtils';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { EVENT_TYPE } from '../event/constants';
import {
  DEFAULT_REGISTRATION_SORT,
  REGISTRATION_LIST_INCLUDES,
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
  const publisher = searchParams.getAll(REGISTRATION_SEARCH_PARAMS.PUBLISHER);
  const sort = searchParams.get(
    REGISTRATION_SEARCH_PARAMS.SORT
  ) as REGISTRATION_SORT_OPTIONS;
  const text = searchParams.get(REGISTRATION_SEARCH_PARAMS.TEXT);

  return {
    eventType,
    page: Number(page) || 1,
    publisher,
    sort: Object.values(REGISTRATION_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_REGISTRATION_SORT,
    text: getValue(text, ''),
  };
};

export const getRegistrationSearchQuery = (
  params: Omit<RegistrationSearchParams, 'sort'>,
  search: string
): string => {
  const { sort } = getRegistrationSearchInitialValues(search);

  return getSearchQuery({
    ...params,
    sort: sort,
  });
};

export const getRegistrationsQueryVariables = (
  search: string
): RegistrationsQueryVariables => {
  const { eventType, page, publisher, text } =
    getRegistrationSearchInitialValues(search);

  return {
    adminUser: true,
    createPath: getPathBuilder(registrationsPathBuilder),
    eventType: eventType.map((type) => capitalize(type)) as EventTypeId[],
    include: REGISTRATION_LIST_INCLUDES,
    page,
    pageSize: REGISTRATIONS_PAGE_SIZE,
    publisher,
    sort: DEFAULT_REGISTRATION_SORT,
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
    case REGISTRATION_SEARCH_PARAMS.SIGNUP_TEXT:
    case REGISTRATION_SEARCH_PARAMS.EVENT_TYPE:
    case REGISTRATION_SEARCH_PARAMS.PAGE:
    case REGISTRATION_SEARCH_PARAMS.PUBLISHER:
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

export const registrationsPathBuilder = ({
  args,
}: PathBuilderProps<RegistrationsQueryVariables>): string => {
  const {
    adminUser,
    eventType,
    include,
    page,
    pageSize,
    publisher,
    sort,
    text,
  } = args;
  const variableToKeyItems = [
    { key: 'admin_user', value: adminUser },
    {
      key: 'event_type',
      value: eventType?.length ? eventType : Object.values(EventTypeId),
    },
    { key: 'include', value: include },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'publisher', value: publisher },
    { key: 'sort', value: sort },
    { key: 'text', value: text },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/registration/${query}`;
};
