import { EVENT_RETURN_PATH_PARAM, EVENT_SEARCH_PARAMS } from './constants';

export type EventFilters = {
  [EVENT_SEARCH_PARAMS.END]?: Date | null;
  [EVENT_SEARCH_PARAMS.PLACE]?: string[];
  [EVENT_SEARCH_PARAMS.START]?: Date | null;
  [EVENT_SEARCH_PARAMS.TEXT]: string;
  [EVENT_SEARCH_PARAMS.TYPE]?: string[];
};

export type EventSearchInitialValues = {
  end: Date | null;
  places: string[];
  start: Date | null;
  text: string;
  types: string[];
};

export type EventFilterType = 'date' | 'place' | 'text' | 'type';

export type EventQueryParams = {
  [EVENT_RETURN_PATH_PARAM]?: string | string[];
};

export type EventQueryParam = keyof EventQueryParams;

export type ReturnParams = {
  [EVENT_RETURN_PATH_PARAM]: string;
  remainingQueryString?: string;
};
