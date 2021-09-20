import isValid from 'date-fns/isValid';
import capitalize from 'lodash/capitalize';
import { scroller } from 'react-scroll';

import { ROUTES } from '../../constants';
import { EventsQueryVariables, EventTypeId } from '../../generated/graphql';
import formatDate from '../../utils/formatDate';
import getPageHeaderHeight from '../../utils/getPageHeaderHeight';
import getPathBuilder from '../../utils/getPathBuilder';
import { getSearchQuery } from '../../utils/searchUtils';
import setFocusToFirstFocusable from '../../utils/setFocusToFirstFocusable';
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
  ReturnParams,
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
  const searchParams = new URLSearchParams(queryString);
  Object.entries(queryParams).forEach(([key, values]) => {
    const param = key as EventSearchParam;
    if (Array.isArray(values)) {
      values.forEach((value) =>
        searchParams.append(param, getEventParamValue({ param, value }))
      );
    } /* istanbul ignore else */ else if (values) {
      searchParams.append(
        param,
        getEventParamValue({ param, value: values.toString() })
      );
    }
  });

  return searchParams.toString() ? `?${searchParams.toString()}` : '';
};

export const replaceParamsToEventQueryString = (
  queryString: string,
  queryParams: Partial<EventSearchParams>
): string => {
  const searchParams = new URLSearchParams(queryString);
  Object.entries(queryParams).forEach(([key, values]) => {
    const param = key as EventSearchParam;
    searchParams.delete(param);

    if (Array.isArray(values)) {
      values.forEach((value) =>
        searchParams.append(param, getEventParamValue({ param, value }))
      );
    } else if (values) {
      searchParams.append(
        param,
        getEventParamValue({ param, value: values.toString() })
      );
    }
  });

  return searchParams.toString() ? `?${searchParams.toString()}` : '';
};

/**
 * Extracts latest return path from queryString. For example on:
 * http://localhost:3000/fi/event/kulke:53397?returnPath=%2Fevents&returnPath=%2Fevent%2Fhelsinki%3Aaf3pnza3zi
 * latest return path is in the last returnPath param on queryString : %2Fevent%2Fhelsinki%3Aaf3pnza3zi
 */
export const extractLatestReturnPath = (queryString: string): ReturnParams => {
  const searchParams = new URLSearchParams(queryString);
  const returnPaths = searchParams.getAll(EVENT_SEARCH_PARAMS.RETURN_PATH);
  // latest path is the last item, it can be popped. If empty, defaults to /events
  const extractedPath = returnPaths.pop() ?? ROUTES.SEARCH;
  // there is no support to delete all but extracted item from same parameter list. This is a workaround to it:
  // 1) delete all first
  searchParams.delete(EVENT_SEARCH_PARAMS.RETURN_PATH);
  // 2) then append all except latest
  returnPaths.forEach((returnPath) =>
    searchParams.append(EVENT_SEARCH_PARAMS.RETURN_PATH, returnPath)
  );
  return {
    returnPath: extractedPath,
    remainingQueryString: searchParams.toString(),
  };
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

export const scrollToEventCard = (id: string): void => {
  const offset = 24;
  const duration = 300;

  scroller.scrollTo(id, {
    delay: 50,
    duration: 300,
    offset: 0 - (getPageHeaderHeight() + offset),
    smooth: true,
  });

  setTimeout(() => setFocusToFirstFocusable(id), duration);
};
