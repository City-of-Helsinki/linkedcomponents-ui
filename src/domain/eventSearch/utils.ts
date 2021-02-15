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
  const text = searchParams.get(EVENT_SEARCH_PARAMS.TEXT);

  const variables: EventsQueryVariables = {
    createPath: getPathBuilder(eventsPathBuilder),
    include: ['in_language', 'location'],
    pageSize: EVENTS_PAGE_SIZE,
    superEvent: 'none',
    text,
  };

  return variables;
};

export const getEventSearchInitialValues = (
  search: string
): EventSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const text = searchParams.get(EVENT_SEARCH_PARAMS.TEXT);

  return {
    text: text || '',
  };
};

export const getEventSearchQuery = (filters: EventFilters): string => {
  return getSearchQuery(filters);
};
