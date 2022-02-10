import isValid from 'date-fns/isValid';
import capitalize from 'lodash/capitalize';

import { EventsQueryVariables, EventTypeId } from '../../generated/graphql';
import addParamsToQueryString from '../../utils/addParamsToQueryString';
import formatDate from '../../utils/formatDate';
import getPathBuilder from '../../utils/getPathBuilder';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import { getSearchQuery } from '../../utils/searchUtils';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { EVENT_TYPE } from '../event/constants';
import {
  DEFAULT_EVENT_SORT,
  EVENT_LIST_INCLUDES,
  EVENT_SORT_OPTIONS,
  EVENTS_PAGE_SIZE,
} from '../events/constants';
import { eventsPathBuilder } from '../events/utils';
import { EVENT_SEARCH_PARAMS } from './constants';
import {
  EventSearchInitialValues,
  EventSearchParam,
  EventSearchParams,
} from './types';

export const getEventsQueryVariables = (
  search: string
): EventsQueryVariables => {
  const searchParams = new URLSearchParams(search);

  const end = searchParams.get(EVENT_SEARCH_PARAMS.END);
  const places = searchParams.getAll(EVENT_SEARCH_PARAMS.PLACE);
  const start = searchParams.get(EVENT_SEARCH_PARAMS.START);

  const { page, sort, text, types } = getEventSearchInitialValues(search);

  return {
    createPath: getPathBuilder(eventsPathBuilder),
    end,
    eventType: types.map((type) => capitalize(type)) as EventTypeId[],
    include: EVENT_LIST_INCLUDES,
    location: places,
    page,
    pageSize: EVENTS_PAGE_SIZE,
    sort,
    start,
    text,
  };
};

export const getEventSearchInitialValues = (
  search: string
): EventSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const end = searchParams.get(EVENT_SEARCH_PARAMS.END);
  const page = searchParams.get(EVENT_SEARCH_PARAMS.PAGE);
  const places = searchParams.getAll(EVENT_SEARCH_PARAMS.PLACE);
  const sort = searchParams.get(EVENT_SEARCH_PARAMS.SORT) as EVENT_SORT_OPTIONS;
  const start = searchParams.get(EVENT_SEARCH_PARAMS.START);
  const text = searchParams.get(EVENT_SEARCH_PARAMS.TEXT);
  const types = searchParams.getAll(EVENT_SEARCH_PARAMS.TYPE) as EVENT_TYPE[];

  return {
    end: end && isValid(new Date(end)) ? new Date(end) : null,
    page: Number(page) || 1,
    places,
    sort: Object.values(EVENT_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_EVENT_SORT,
    start: start && isValid(new Date(start)) ? new Date(start) : null,
    text: text || '',
    types,
  };
};

export const getEventParamValue = ({
  param,
  value,
}: {
  param: EventSearchParam;
  value: string;
}): string => {
  switch (param) {
    case EVENT_SEARCH_PARAMS.END:
    case EVENT_SEARCH_PARAMS.START:
      return formatDate(new Date(value), 'yyyy-MM-dd');
    case EVENT_SEARCH_PARAMS.PAGE:
    case EVENT_SEARCH_PARAMS.PLACE:
    case EVENT_SEARCH_PARAMS.SORT:
    case EVENT_SEARCH_PARAMS.TEXT:
    case EVENT_SEARCH_PARAMS.TYPE:
      return value;
    case EVENT_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown event query parameter');
  }
};

export const addParamsToEventQueryString = (
  queryString: string,
  queryParams: Partial<EventSearchParams>
): string => {
  return addParamsToQueryString<EventSearchParams>(
    queryString,
    queryParams,
    getEventParamValue
  );
};

export const replaceParamsToEventQueryString = (
  queryString: string,
  queryParams: Partial<EventSearchParams>
): string => {
  return replaceParamsToQueryString<EventSearchParams>(
    queryString,
    queryParams,
    getEventParamValue
  );
};

export const getEventSearchQuery = (
  { end, start, ...rest }: Omit<EventSearchParams, 'sort'>,
  search = ''
): string => {
  const { sort } = getEventSearchInitialValues(search);

  return getSearchQuery({
    ...rest,
    end: end ? formatDate(end, 'yyyy-MM-dd') : undefined,
    sort: sort !== DEFAULT_EVENT_SORT ? sort : null,
    start: start ? formatDate(start, 'yyyy-MM-dd') : undefined,
  });
};

export const getEventItemId = (id: string): string => `event-item${id}`;
