import isValid from 'date-fns/isValid';

import { EventsQueryVariables } from '../../generated/graphql';
import formatDate from '../../utils/formatDate';
import getPathBuilder from '../../utils/getPathBuilder';
import { getSearchQuery } from '../../utils/searchUtils';
import { EVENT_LIST_INCLUDES, EVENTS_PAGE_SIZE } from '../events/constants';
import { eventsPathBuilder } from '../events/utils';
import { EVENT_SEARCH_PARAMS } from './constants';
import { EventFilters, EventSearchInitialValues } from './types';

export const getEventsQueryVariables = (
  search: string
): EventsQueryVariables => {
  const searchParams = new URLSearchParams(search);
  const end = searchParams.get(EVENT_SEARCH_PARAMS.END);
  const places = searchParams.getAll(EVENT_SEARCH_PARAMS.PLACE);
  const start = searchParams.get(EVENT_SEARCH_PARAMS.START);
  const text = searchParams.get(EVENT_SEARCH_PARAMS.TEXT);

  const variables: EventsQueryVariables = {
    createPath: getPathBuilder(eventsPathBuilder),
    end,
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
