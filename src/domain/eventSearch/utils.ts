import { EventsQueryVariables } from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import { getSearchQuery } from '../../utils/searchUtils';
import { EVENTS_PAGE_SIZE } from '../events/constants';
import { eventsPathBuilder } from '../events/utils';
import { EVENT_SEARCH_PARAMS } from './constants';
import { EventFilters, EventSearchInitialValues } from './types';

export const getEventsQueryVariables = (
  search: string
): EventsQueryVariables => {
  const searchParams = new URLSearchParams(search);
  const places = searchParams.getAll(EVENT_SEARCH_PARAMS.PLACE);
  const text = searchParams.get(EVENT_SEARCH_PARAMS.TEXT);

  const variables: EventsQueryVariables = {
    createPath: getPathBuilder(eventsPathBuilder),
    include: ['in_language', 'location'],
    pageSize: EVENTS_PAGE_SIZE,
    location: places,
    superEvent: 'none',
    text,
  };

  return variables;
};

export const getEventSearchInitialValues = (
  search: string
): EventSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const places = searchParams.getAll(EVENT_SEARCH_PARAMS.PLACE);
  const text = searchParams.get(EVENT_SEARCH_PARAMS.TEXT);
  const types = searchParams.getAll(EVENT_SEARCH_PARAMS.TYPE);

  return {
    places,
    text: text || '',
    types,
  };
};

export const getEventSearchQuery = (filters: EventFilters): string => {
  return getSearchQuery(filters);
};
