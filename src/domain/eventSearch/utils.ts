import isValid from 'date-fns/isValid';

import { ROUTES } from '../../constants';
import { EventsQueryVariables, EventTypeId } from '../../generated/graphql';
import formatDate from '../../utils/formatDate';
import getPathBuilder from '../../utils/getPathBuilder';
import { getSearchQuery } from '../../utils/searchUtils';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { EVENT_LIST_INCLUDES, EVENTS_PAGE_SIZE } from '../events/constants';
import { eventsPathBuilder } from '../events/utils';
import { EVENT_RETURN_PATH_PARAM, EVENT_SEARCH_PARAMS } from './constants';
import {
  EventFilters,
  EventQueryParam,
  EventQueryParams,
  EventSearchInitialValues,
  ReturnParams,
} from './types';

export const getEventsQueryVariables = (
  search: string
): EventsQueryVariables => {
  const searchParams = new URLSearchParams(search);
  const end = searchParams.get(EVENT_SEARCH_PARAMS.END);
  const places = searchParams.getAll(EVENT_SEARCH_PARAMS.PLACE);
  const start = searchParams.get(EVENT_SEARCH_PARAMS.START);
  const text = searchParams.get(EVENT_SEARCH_PARAMS.TEXT);
  const type = searchParams.getAll(EVENT_SEARCH_PARAMS.TYPE);

  const variables: EventsQueryVariables = {
    createPath: getPathBuilder(eventsPathBuilder),
    end,
    eventType: type as EventTypeId[],
    include: EVENT_LIST_INCLUDES,
    pageSize: EVENTS_PAGE_SIZE,
    location: places,
    start,
    // superEvent: 'none',
    text,
  };

  return variables;
};

export const getEventSearchInitialValues = (
  search: string
): EventSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const end = searchParams.get(EVENT_SEARCH_PARAMS.END);
  const places = searchParams.getAll(EVENT_SEARCH_PARAMS.PLACE);
  const start = searchParams.get(EVENT_SEARCH_PARAMS.START);
  const text = searchParams.get(EVENT_SEARCH_PARAMS.TEXT);
  const types = searchParams.getAll(EVENT_SEARCH_PARAMS.TYPE);

  return {
    end: end && isValid(new Date(end)) ? new Date(end) : null,
    places,
    start: start && isValid(new Date(start)) ? new Date(start) : null,
    text: text || '',
    types,
  };
};

export const getEventParamValue = ({
  param,
  value,
}: {
  param: EventQueryParam;
  value: string;
}) => {
  switch (param) {
    case EVENT_RETURN_PATH_PARAM:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown event query parameter');
  }
};

export const addParamsToEventQueryString = (
  queryString: string,
  queryParams: EventQueryParams
): string => {
  const searchParams = new URLSearchParams(queryString);
  Object.entries(queryParams).forEach(([key, values]) => {
    const param = key as EventQueryParam;
    if (Array.isArray(values)) {
      values.forEach((value) =>
        searchParams.append(param, getEventParamValue({ param, value }))
      );
    } else if (values) {
      searchParams.append(param, getEventParamValue({ param, value: values }));
    }
  });
  return '?' + searchParams.toString();
};

/**
 * Extracts latest return path from queryString. For example on:
 * http://localhost:3000/fi/event/kulke:53397?returnPath=%2Fevents&returnPath=%2Fevent%2Fhelsinki%3Aaf3pnza3zi
 * latest return path is in the last returnPath param on queryString : %2Fevent%2Fhelsinki%3Aaf3pnza3zi
 */
export const extractLatestReturnPath = (queryString: string): ReturnParams => {
  const searchParams = new URLSearchParams(queryString);
  const returnPaths = searchParams.getAll(EVENT_RETURN_PATH_PARAM);
  // latest path is the last item, it can be popped. If empty, defaults to /events
  const extractedPath = returnPaths.pop() ?? ROUTES.SEARCH;
  // there is no support to delete all but extracted item from same parameter list. This is a workaround to it:
  // 1) delete all first
  searchParams.delete(EVENT_RETURN_PATH_PARAM);
  // 2) then append all except latest
  returnPaths.forEach((returnPath) =>
    searchParams.append(EVENT_RETURN_PATH_PARAM, returnPath)
  );
  return {
    returnPath: extractedPath,
    remainingQueryString: searchParams.toString(),
  };
};

export const getEventSearchQuery = ({
  end,
  start,
  ...rest
}: EventFilters): string => {
  return getSearchQuery({
    ...rest,
    end: end ? formatDate(end, 'yyyy-MM-dd') : undefined,
    start: start ? formatDate(start, 'yyyy-MM-dd') : undefined,
  });
};
